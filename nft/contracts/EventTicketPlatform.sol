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
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

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
    ReentrancyGuardUpgradeable,
    UniversalNFTCore
{
    // Ticket Types & Categories
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

    struct Event {
        uint256 eventId;
        string name;
        string description;
        EventCategory category;
        uint256 startTime;
        uint256 endTime;
        EventStatus status;
        address organizer;
        uint256 totalTickets;
        uint256 soldTickets;
        uint256 basePrice;
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

    struct PromoCode {
        string code;
        uint256 discountPercentage;
        uint256 maxUses;
        uint256 currentUses;
        uint256 validUntil;
        bool isActive;
    }

    // State variables
    uint256 public _nextTokenId;
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

    // Events
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
        __ReentrancyGuard_init();
        __UniversalNFTCore_init(gatewayAddress, gas, uniswapRouterAddress); // Initialize universal NFT core

        _platformFeePercentage = platformFeePercentage_;
        _platformTreasury = platformTreasury_;
    }

    // Event Management Functions
    function createEvent(
        string memory name,
        string memory description,
        EventCategory category,
        uint256 startTime,
        uint256 endTime,
        uint256 basePrice,
        uint256[] memory tierCapacities,
        uint256[] memory tierPrices
    ) public returns (uint256) {
        require(startTime > block.timestamp, "Event must start in the future");
        require(endTime > startTime, "End time must be after start time");
        require(
            tierCapacities.length == 3,
            "Must provide capacities for all tiers"
        );
        require(tierPrices.length == 3, "Must provide prices for all tiers");

        uint256 eventId = _nextEventId++;
        Event storage newEvent = events[eventId];

        newEvent.eventId = eventId;
        newEvent.name = name;
        newEvent.description = description;
        newEvent.category = category;
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;
        newEvent.status = EventStatus.Created;
        newEvent.organizer = msg.sender;
        newEvent.basePrice = basePrice;

        uint256 totalCapacity = 0;
        for (uint i = 0; i < 3; i++) {
            newEvent.tierCapacities[TicketTier(i)] = tierCapacities[i];
            newEvent.tierPrices[TicketTier(i)] = tierPrices[i];
            totalCapacity += tierCapacities[i];
        }
        newEvent.totalTickets = totalCapacity;

        userEvents[msg.sender].push(eventId);

        emit EventCreated(eventId, name, msg.sender);
        return eventId;
    }

    function activateEvent(uint256 eventId) public {
        Event storage event_ = events[eventId];
        require(
            msg.sender == event_.organizer,
            "Only organizer can activate event"
        );
        require(
            event_.status == EventStatus.Created,
            "Event must be in Created status"
        );
        require(
            block.timestamp < event_.startTime,
            "Event must not have started"
        );

        event_.status = EventStatus.Active;
    }

    function cancelEvent(uint256 eventId) public {
        Event storage event_ = events[eventId];
        require(
            msg.sender == event_.organizer,
            "Only organizer can cancel event"
        );
        require(
            event_.status == EventStatus.Active ||
                event_.status == EventStatus.Created,
            "Event cannot be cancelled"
        );

        event_.status = EventStatus.Cancelled;

        // Process refunds for sold tickets
        for (uint i = 0; i < eventAttendees[eventId].length; i++) {
            address attendee = eventAttendees[eventId][i];
            // Refund logic here
        }

        emit EventCancelled(eventId, msg.sender);
    }

    // Ticket Purchase Functions
    function purchaseTicket(
        uint256 eventId,
        TicketTier tier,
        string memory promoCode
    ) public payable nonReentrant returns (uint256) {
        Event storage event_ = events[eventId];
        require(event_.status == EventStatus.Active, "Event is not active");
        require(
            block.timestamp < event_.startTime,
            "Event has already started"
        );
        require(
            event_.tierSold[tier] < event_.tierCapacities[tier],
            "Tier is sold out"
        );

        uint256 ticketPrice = event_.tierPrices[tier];

        // Apply promo code discount
        if (bytes(promoCode).length > 0) {
            PromoCode storage promo = promoCodes[promoCode];
            require(promo.isActive, "Invalid promo code");
            require(
                promo.currentUses < promo.maxUses,
                "Promo code usage limit reached"
            );
            require(block.timestamp < promo.validUntil, "Promo code expired");

            uint256 discount = (ticketPrice * promo.discountPercentage) / 100;
            ticketPrice -= discount;
            promo.currentUses++;
        }

        require(msg.value >= ticketPrice, "Insufficient payment");

        // Mint ticket
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Create ticket record
        Ticket storage ticket = tickets[tokenId];
        ticket.tokenId = tokenId;
        ticket.eventId = eventId;
        ticket.tier = tier;
        ticket.purchasePrice = ticketPrice;
        ticket.purchaseTime = block.timestamp;
        ticket.owner = msg.sender;
        ticket.isTransferable = true;
        ticket.transferLockUntil = block.timestamp + 24 hours; // 24-hour transfer lock

        // Update event stats
        event_.tierSold[tier]++;
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

        emit TicketMinted(tokenId, eventId, msg.sender, tier);
        return tokenId;
    }

    // Resale Functions
    function listTicketForResale(uint256 tokenId, uint256 resalePrice) public {
        require(
            ownerOf(tokenId) == msg.sender ||
                getApproved(tokenId) == msg.sender ||
                isApprovedForAll(ownerOf(tokenId), msg.sender),
            "Not authorized"
        );
        require(
            block.timestamp > tickets[tokenId].transferLockUntil,
            "Transfer lock not expired"
        );

        Ticket storage ticket = tickets[tokenId];
        Event storage event_ = events[ticket.eventId];
        require(event_.status == EventStatus.Active, "Event is not active");
        require(
            block.timestamp < event_.startTime,
            "Event has already started"
        );

        ticket.isResale = true;
        ticket.resalePrice = resalePrice;
    }

    function purchaseResaleTicket(uint256 tokenId) public payable nonReentrant {
        Ticket storage ticket = tickets[tokenId];
        require(ticket.isResale, "Ticket not listed for resale");
        require(msg.value >= ticket.resalePrice, "Insufficient payment");

        address seller = ticket.owner;
        uint256 resalePrice = ticket.resalePrice;

        // Transfer ticket
        _transfer(seller, msg.sender, tokenId);

        // Update ticket record
        ticket.owner = msg.sender;
        ticket.isResale = false;
        ticket.resalePrice = 0;
        ticket.isTransferable = true;
        ticket.transferLockUntil = block.timestamp + 24 hours;

        // Update user ticket lists
        _removeFromArray(userTickets[seller], tokenId);
        userTickets[msg.sender].push(tokenId);

        // Handle payment
        uint256 platformFee = (resalePrice * _platformFeePercentage) / 100;
        uint256 sellerPayment = resalePrice - platformFee;

        payable(_platformTreasury).transfer(platformFee);
        payable(seller).transfer(sellerPayment);

        // Refund excess payment
        if (msg.value > resalePrice) {
            payable(msg.sender).transfer(msg.value - resalePrice);
        }

        emit TicketResold(tokenId, seller, msg.sender, resalePrice);
    }

    // Promo Code Management
    function createPromoCode(
        string memory code,
        uint256 discountPercentage,
        uint256 maxUses,
        uint256 validUntil
    ) public onlyOwner {
        require(discountPercentage <= 100, "Discount cannot exceed 100%");
        require(
            validUntil > block.timestamp,
            "Valid until must be in the future"
        );

        promoCodes[code] = PromoCode({
            code: code,
            discountPercentage: discountPercentage,
            maxUses: maxUses,
            currentUses: 0,
            validUntil: validUntil,
            isActive: true
        });

        emit PromoCodeCreated(code, discountPercentage);
    }

    // View Functions
    function getEvent(
        uint256 eventId
    )
        public
        view
        returns (
            uint256 eventId_,
            string memory name,
            string memory description,
            EventCategory category,
            uint256 startTime,
            uint256 endTime,
            EventStatus status,
            address organizer,
            uint256 totalTickets,
            uint256 soldTickets,
            uint256 basePrice
        )
    {
        Event storage event_ = events[eventId];
        return (
            event_.eventId,
            event_.name,
            event_.description,
            event_.category,
            event_.startTime,
            event_.endTime,
            event_.status,
            event_.organizer,
            event_.totalTickets,
            event_.soldTickets,
            event_.basePrice
        );
    }

    function getTicket(
        uint256 tokenId
    )
        public
        view
        returns (
            uint256 tokenId_,
            uint256 eventId,
            TicketTier tier,
            uint256 purchasePrice,
            uint256 purchaseTime,
            address owner,
            bool isResale,
            uint256 resalePrice,
            bool isTransferable,
            uint256 transferLockUntil
        )
    {
        Ticket storage ticket = tickets[tokenId];
        return (
            ticket.tokenId,
            ticket.eventId,
            ticket.tier,
            ticket.purchasePrice,
            ticket.purchaseTime,
            ticket.owner,
            ticket.isResale,
            ticket.resalePrice,
            ticket.isTransferable,
            ticket.transferLockUntil
        );
    }

    function getEventTierInfo(
        uint256 eventId,
        TicketTier tier
    ) public view returns (uint256 capacity, uint256 sold, uint256 price) {
        Event storage event_ = events[eventId];
        return (
            event_.tierCapacities[tier],
            event_.tierSold[tier],
            event_.tierPrices[tier]
        );
    }

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
        require(newFeePercentage <= 20, "Fee cannot exceed 20%");
        _platformFeePercentage = newFeePercentage;
    }

    function setPlatformTreasury(address newTreasury) public onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
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

    // Helper function to remove item from array
    function _removeFromArray(uint256[] storage array, uint256 item) internal {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == item) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    receive() external payable {}
}
