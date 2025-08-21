// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {ERC721BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import {ERC721EnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import {ERC721PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import {ERC721URIStorageUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Import UniversalNFTCore for universal NFT functionality
import "@zetachain/standard-contracts/contracts/nft/contracts/zetachain/UniversalNFTCore.sol";
error EventMustStartInFuture();
    error EndTimeMustBeAfterStartTime();
    error OnlyOrganizerCanCancelEvent();
    error EventCannotBeCancelled();
    error EventIsNotActive();
    error EventHasAlreadyStarted();
    error TierIsSoldOut();
    error InsufficientPayment();
    error FeeCannotExceed20Percent();
    error InvalidTreasuryAddress();

contract ZetaChainUniversalNFT is
    Initializable, // Allows upgradeable contract initialization
    ERC721Upgradeable, // Base ERC721 implementation
    ERC721URIStorageUpgradeable, // Enables metadata URI storage
    ERC721EnumerableUpgradeable, // Provides enumerable token support
    ERC721PausableUpgradeable, // Allows pausing token operations
    OwnableUpgradeable, // Restricts access to owner-only functions
    ERC721BurnableUpgradeable, // Adds burnable functionality
    UUPSUpgradeable, // Supports upgradeable proxy pattern
    UniversalNFTCore // Custom core for additional logic
{
    uint256 public _nextTokenId; // Track next token ID for minting
    //  uint256 _nextEventId;

     enum TicketTier {
        General,
        Premium,
        VIP
    }
    enum EventCategory {
        Concert,
        Sports,
        Conference,
        Theater,
        Festival,
        Exhibition,
        Other
    }
    enum EventStatus {
        Created,
        Active,
        SoldOut,
        Cancelled,
        Completed
    }

    // eventDetails -> name description tiers 
    struct Event {
        string eventDetails;
        EventCategory category;
        uint256 startTime;
        uint256 endTime;
        EventStatus status;
        address organizer;
        uint256 totalTickets;
        uint256 soldTickets;
        uint256 basePrice;
    }

    // TicketTier tier; add to ipfs
     struct Ticket {
        uint256 tokenId;
        uint256 eventId;
        address owner;
        bool isTransferable;
        uint256 purchasePrice;
    }

    uint256 public _nextEventId;
    uint256 private _platformFeePercentage;
    address private _platformTreasury;

    // Mappings
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    // mapping(string => PromoCode) public promoCodes;
    mapping(address => uint256[]) public userEvents;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => address[]) public eventAttendees;

    event EventCreated(
        uint256 indexed eventId,
        string name,
        address indexed organizer
    );
    event TicketMinted(
        uint256 indexed tokenId,
        uint256 indexed eventId,
        address indexed buyer
    );
    
    event EventCancelled(uint256 indexed eventId, address indexed organizer);



    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        string memory name,
        string memory symbol,
        address payable gatewayAddress, // Include EVM gateway address
        uint256 gas, // Set gas limit for universal NFT calls
        address uniswapRouterAddress // Uniswap v2 router address for gas token swaps
    ) public initializer {
        __ERC721_init(name, symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Pausable_init();
        __Ownable_init(initialOwner);
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
        __UniversalNFTCore_init(gatewayAddress, gas, uniswapRouterAddress); // Initialize universal NFT core
    }

    function create_ticket(
        string memory eventDetails,
        EventCategory category,
        uint256 startTime,
        uint256 endTime,
        uint256 basePrice, uint256 totalTickets
    ) public  whenNotPaused {
        if (startTime <= block.timestamp) {
            revert EventMustStartInFuture();
        }
        if (endTime <= startTime) {
            revert EndTimeMustBeAfterStartTime();
        }
        // uint256 eventId =
        Event storage newEvent = events[ _nextEventId];

        newEvent.eventDetails = eventDetails;
        newEvent.category = category;
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;
        newEvent.status = EventStatus.Active; // Events are automatically active when created
        newEvent.organizer = msg.sender;
        newEvent.basePrice = basePrice;

         _nextEventId++;


    }

     function purchaseTicket(uint256 eventId) public payable returns (uint256) {
        Event storage event_ = events[eventId];
        if (event_.status != EventStatus.Active) {
            revert EventIsNotActive();
        }
        if (block.timestamp >= event_.startTime) {
            revert EventHasAlreadyStarted();
        }
        if (event_.soldTickets >= event_.totalTickets) {
            revert TierIsSoldOut();
        }

        uint256 ticketPrice = event_.basePrice;

        if (msg.value < ticketPrice) {
            revert InsufficientPayment();
        }

        // Mint ticket
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, event_.eventDetails);

        // Create ticket record
        Ticket storage ticket = tickets[tokenId];
        ticket.tokenId = tokenId;
        ticket.eventId = eventId;
        ticket.purchasePrice = ticketPrice;
        ticket.owner = msg.sender;
        ticket.isTransferable = true;

        // Update event stats
        event_.soldTickets++;
        eventAttendees[eventId].push(msg.sender);
        userTickets[msg.sender].push(tokenId);

        // Check if event is sold out
        if (event_.soldTickets == event_.totalTickets) {
            event_.status = EventStatus.SoldOut;
        }

        // Handle payment distribution
        uint256 platformFee = (ticketPrice * _platformFeePercentage) / 100;
        uint256 organizerPayment = ticketPrice - platformFee;

        payable(_platformTreasury).transfer(platformFee);
        payable(event_.organizer).transfer(organizerPayment);

        // Refund excess payment
        if (msg.value > ticketPrice) {
            payable(msg.sender).transfer(msg.value - ticketPrice);
        }

        emit TicketMinted(tokenId, eventId, msg.sender);
        return tokenId;
    }

    // function safeMint(
    //     address to,
    //     string memory uri
    // ) public onlyOwner whenNotPaused {
    //     // Generate globally unique token ID, feel free to supply your own logic
    //     uint256 hash = uint256(
    //         keccak256(
    //             abi.encodePacked(address(this), block.number, _nextTokenId++)
    //         )
    //     );

    //     uint256 tokenId = hash & 0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    //     _safeMint(to, tokenId);
    //     _setTokenURI(tokenId, uri);
    // }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721PausableUpgradeable
        )
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721URIStorageUpgradeable,
            UniversalNFTCore // Include UniversalNFTCore for URI overrides
        )
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721URIStorageUpgradeable,
            UniversalNFTCore // Include UniversalNFTCore for interface overrides
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    receive() external payable {} // Receive ZETA to pay for gas
}
