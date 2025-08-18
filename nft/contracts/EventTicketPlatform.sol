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

contract EventTicketPlatform is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721PausableUpgradeable,
    OwnableUpgradeable,
    ERC721BurnableUpgradeable,
    UUPSUpgradeable,
    UniversalNFTCore
{
    // Custom Errors
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

    // Ticket Types & Categories load this on ipfs
    // enum TicketTier {
    //     General,
    //     Premium,
    //     VIP
    // }
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
        Active,
        SoldOut,
        Cancelled,
        Completed
    }

    struct Event {
        uint256 eventId;
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

    struct Ticket {
        uint256 tokenId;
        uint256 eventId;
        uint256 purchasePrice;
        uint256 purchaseTime;
        address owner;
        bool isTransferable;
        uint256 transferLockUntil;
    }

    // State variables
    uint256 public _nextTokenId;
    uint256 public _nextEventId;
    uint256 private _platformFeePercentage;
    address private _platformTreasury;

    // Mappings
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userEvents;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => address[]) public eventAttendees;

    // Events
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
        address payable gatewayAddress,
        uint256 gas,
        address uniswapRouterAddress,
        uint256 platformFeePercentage_,
        address platformTreasury_
    ) public initializer {
        __ERC721_init(name, symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721Pausable_init();
        __Ownable_init(initialOwner);
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();

        __UniversalNFTCore_init(gatewayAddress, gas, uniswapRouterAddress); // Initialize universal NFT core

        _platformFeePercentage = platformFeePercentage_;
        _platformTreasury = platformTreasury_;
    }

    // Event Management Functions
    function createEvent(
        string memory eventDetails,
        EventCategory category,
        uint256 startTime,
        uint256 endTime,
        uint256 basePrice
    ) public returns (uint256) {
        if (startTime <= block.timestamp) {
            revert EventMustStartInFuture();
        }
        if (endTime <= startTime) {
            revert EndTimeMustBeAfterStartTime();
        }

        uint256 eventId = _nextEventId++;
        Event storage newEvent = events[eventId];

        newEvent.eventId = eventId;
        newEvent.eventDetails = eventDetails;
        newEvent.category = category;
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;
        newEvent.status = EventStatus.Active; // Events are automatically active when created
        newEvent.organizer = msg.sender;
        newEvent.basePrice = basePrice;

        uint256 totalCapacity = 0;

        newEvent.totalTickets = totalCapacity;

        userEvents[msg.sender].push(eventId);

        emit EventCreated(eventId, eventDetails, msg.sender);
        return eventId;
    }

    function cancelEvent(uint256 eventId) public {
        Event storage event_ = events[eventId];
        if (msg.sender != event_.organizer) {
            revert OnlyOrganizerCanCancelEvent();
        }
        if (event_.status != EventStatus.Active) {
            revert EventCannotBeCancelled();
        }

        event_.status = EventStatus.Cancelled;

        // Process refunds for sold tickets
        for (uint i = 0; i < eventAttendees[eventId].length; i++) {
            address attendee = eventAttendees[eventId][i];
            // Refund logic here
        }

        emit EventCancelled(eventId, msg.sender);
    }

    // Ticket Purchase Functions
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

        // Create ticket record
        Ticket storage ticket = tickets[tokenId];
        ticket.tokenId = tokenId;
        ticket.eventId = eventId;
        ticket.purchasePrice = ticketPrice;
        ticket.purchaseTime = block.timestamp;
        ticket.owner = msg.sender;
        ticket.isTransferable = true;
        ticket.transferLockUntil = block.timestamp + 24 hours; // 24-hour transfer lock

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

    // Promo Code Management

    // View Functions
    // function getEvent(
    //     uint256 eventId
    // )
    //     public
    //     view
    //     returns (
    //         uint256 eventId_,
    //         string eventDetails,
    //         EventCategory category,
    //         uint256 startTime,
    //         uint256 endTime,
    //         EventStatus status,
    //         address organizer,
    //         uint256 totalTickets,
    //         uint256 soldTickets,
    //         uint256 basePrice
    //     )
    // {
    //     Event storage event_ = events[eventId];
    //     return (
    //         event_.eventId,
    //         event_.eventDetails,
    //         event_.category,
    //         event_.startTime,
    //         event_.endTime,
    //         event_.status,
    //         event_.organizer,
    //         event_.totalTickets,
    //         event_.soldTickets,
    //         event_.basePrice
    //     );
    // }

    // function getTicket(
    //     uint256 tokenId
    // )
    //     public
    //     view
    //     returns (
    //         uint256 tokenId_,
    //         uint256 eventId,
    //         uint256 purchasePrice,
    //         uint256 purchaseTime,
    //         address owner,
    //         bool isTransferable,
    //         uint256 transferLockUntil
    //     )
    // {
    //     Event storage event_ = events[eventId];
    //     return (
    //         ticket.tokenId,
    //         ticket.eventId,
    //         ticket.purchasePrice,
    //         ticket.purchaseTime,
    //         ticket.owner,
    //         ticket.isTransferable,
    //         ticket.transferLockUntil
    //     );
    // }

    // function getEventTierInfo(
    //     uint256 eventId
    // ) public view returns (uint256 capacity, uint256 sold, uint256 price) {
    //     Event storage event_ = events[eventId];
    //     return (
    //         event_.tierCapacities[tier],
    //         event_.tierSold[tier],
    //         event_.tierPrices[tier]
    //     );
    // }

    function getUserEvents(
        address user
    ) public view returns (uint256[] memory) {
        return userEvents[user];
    }

    function getUserTickets(
        address user
    ) public view returns (uint256[] memory) {
        return userTickets[user];
    }

    function getEventAttendees(
        uint256 eventId
    ) public view returns (address[] memory) {
        return eventAttendees[eventId];
    }

    // Admin Functions
    function setPlatformFeePercentage(
        uint256 newFeePercentage
    ) public onlyOwner {
        if (newFeePercentage > 20) {
            revert FeeCannotExceed20Percent();
        }
        _platformFeePercentage = newFeePercentage;
    }

    function setPlatformTreasury(address newTreasury) public onlyOwner {
        if (newTreasury == address(0)) {
            revert InvalidTreasuryAddress();
        }
        _platformTreasury = newTreasury;
    }

    // Override functions
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
            UniversalNFTCore
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
            UniversalNFTCore
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

    receive() external payable {}
}
