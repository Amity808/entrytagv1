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
    uint256 private _nextTokenId; // Track next token ID for minting

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

    // eventDetails -> name description
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
        bool isCrossChain;
        mapping(TicketTier => uint256) tierPrices;
        mapping(TicketTier => uint256) tierCapacities;
        mapping(TicketTier => uint256) tierSold;
    }

     struct Ticket {
        uint256 tokenId;
        uint256 eventId;
        TicketTier tier;
        uint256 purchasePrice;
        uint256 purchaseTime;
        address owner;
        bool isResale;
        uint256 resalePrice;
        bool isTransferable;
        uint256 transferLockUntil;
    }

    uint256 public _nextEventId;
    uint256 private _platformFeePercentage;
    address private _platformTreasury;

    // Mappings
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(string => PromoCode) public promoCodes;
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
        address indexed buyer,
        TicketTier tier
    );
    event TicketResold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    event EventCancelled(uint256 indexed eventId, address indexed organizer);
    event PromoCodeCreated(string code, uint256 discountPercentage);
    event CrossChainTransferInitiated(
        uint256 indexed tokenId,
        string fromChain,
        string toChain
    );

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

    function safeMint(
        address to,
        string memory uri
    ) public onlyOwner whenNotPaused {
        // Generate globally unique token ID, feel free to supply your own logic
        uint256 hash = uint256(
            keccak256(
                abi.encodePacked(address(this), block.number, _nextTokenId++)
            )
        );

        uint256 tokenId = hash & 0x00FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

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
