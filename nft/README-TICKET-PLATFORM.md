# Event Ticket Platform on ZetaChain

A comprehensive, upgradeable NFT-based event ticket platform built on ZetaChain that enables cross-chain ticket creation, sales, and transfers.

## 🎫 Core Features

### 1. Ticket Types & Categories

- **Ticket Tiers**: General, Premium, VIP with different pricing and capacities
- **Event Categories**: Concert, Sports, Conference, Theater, Festival, Exhibition, Other
- **Venue Information**: Name, address, capacity, and seating map support

### 2. Event Management

- **Event Creation**: Organizers can create events with detailed information
- **Event Lifecycle**: Created → Active → SoldOut/Cancelled/Completed
- **Capacity Management**: Automatic sold-out detection and status updates
- **Event Cancellation**: Support for event cancellation with refund mechanisms

### 3. Pricing & Sales Management

- **Dynamic Pricing**: Different prices for different ticket tiers
- **Promo Codes**: Discount system with usage limits and expiration dates
- **Platform Fees**: Configurable platform fee percentage (default: 5%)
- **Payment Distribution**: Automatic distribution to organizers and platform treasury

### 4. Secondary Market Controls

- **Resale Functionality**: Users can list tickets for resale
- **Transfer Locks**: 24-hour transfer lock after purchase to prevent immediate flipping
- **Resale Fees**: Platform fees on secondary sales
- **Price Controls**: Organizers can set maximum resale prices

### 5. Cross-Chain Integration

- **ZetaChain Support**: Built on UniversalNFTCore for cross-chain capabilities
- **Multi-Chain Events**: Events can support multiple blockchain networks
- **Cross-Chain Transfers**: Tickets can be transferred between supported chains
- **Universal Discovery**: Cross-chain event discovery and ticket purchasing

## 🏗️ Technical Architecture

### Smart Contract Features

- **Upgradeable**: Uses OpenZeppelin's UUPS upgradeable pattern
- **ERC721 Compliant**: Standard NFT functionality with extensions
- **Reentrancy Protection**: Secure against reentrancy attacks
- **Access Control**: Owner-only functions for administrative operations

### Data Structures

```solidity
struct Event {
    uint256 eventId;
    string name;
    string description;
    EventCategory category;
    uint256 startTime;
    uint256 endTime;
    VenueInfo venue;
    EventStatus status;
    address organizer;
    uint256 totalTickets;
    uint256 soldTickets;
    uint256 basePrice;
    bool isCrossChain;
    string[] supportedChains;
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
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm/yarn
- Hardhat development environment
- ZetaChain testnet access

### Installation

```bash
# Install dependencies
yarn install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy-ticket-platform.ts --network localhost
```

### Deployment

```bash
# Deploy to ZetaChain testnet
npx hardhat run scripts/deploy-ticket-platform.ts --network zeta-testnet

# Deploy to ZetaChain mainnet
npx hardhat run scripts/deploy-ticket-platform.ts --network zeta-mainnet
```

## 📋 Usage Examples

### Creating an Event

```solidity
// Create a concert event
uint256 eventId = ticketPlatform.createEvent(
    "Summer Music Festival 2024",
    "The biggest music festival of the year",
    EventCategory.Concert,
    block.timestamp + 30 days, // Start time
    block.timestamp + 30 days + 8 hours, // End time
    VenueInfo({
        name: "Central Park",
        address_: "123 Music Ave, New York",
        capacity: 10000,
        seatingMap: "https://example.com/seating-map"
    }),
    0.1 ether, // Base price
    [8000, 1500, 500], // Tier capacities: General, Premium, VIP
    [0.1 ether, 0.25 ether, 0.5 ether], // Tier prices
    true, // Cross-chain support
    ["ethereum", "polygon", "bsc"] // Supported chains
);
```

### Purchasing a Ticket

```solidity
// Purchase a VIP ticket with promo code
uint256 tokenId = ticketPlatform.purchaseTicket{value: 0.5 ether}(
    eventId,
    TicketTier.VIP,
    "SUMMER20" // 20% discount promo code
);
```

### Listing for Resale

```solidity
// List ticket for resale
ticketPlatform.listTicketForResale(tokenId, 0.6 ether);
```

### Cross-Chain Transfer

```solidity
// Initiate cross-chain transfer
ticketPlatform.initiateCrossChainTransfer(tokenId, "polygon");
```

## 🔧 Configuration

### Platform Settings

- **Platform Fee**: Configurable percentage (default: 5%)
- **Treasury Address**: Platform fee collection address
- **Transfer Lock Duration**: Configurable transfer lock period

### ZetaChain Integration

- **Gateway Address**: ZetaChain gateway contract address
- **Gas Limits**: Configurable gas limits for cross-chain operations
- **Supported Chains**: Dynamic list of supported blockchain networks

## 🧪 Testing

### Test Scenarios

- Event creation and management
- Ticket purchasing with different tiers
- Promo code application and validation
- Resale functionality
- Cross-chain transfer initiation
- Event cancellation and refunds
- Access control and security

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/EventTicketPlatform.test.ts

# Run with coverage
npx hardhat coverage
```

## 🔒 Security Features

- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Owner-only administrative functions
- **Transfer Locks**: Prevents immediate ticket flipping
- **Input Validation**: Comprehensive parameter validation
- **Safe Math**: Built-in overflow protection

## 🌐 Cross-Chain Features

### Supported Networks

- Ethereum
- Polygon
- Binance Smart Chain
- Arbitrum
- Optimism
- And more via ZetaChain integration

### Cross-Chain Benefits

- **Universal Access**: Buy tickets on any supported chain
- **Reduced Gas Costs**: Choose the most cost-effective network
- **Interoperability**: Seamless cross-chain ticket transfers
- **Liquidity**: Access to multiple blockchain ecosystems

## 📈 Future Enhancements

### Planned Features

- **Dynamic Pricing**: AI-powered demand-based pricing
- **Staking Rewards**: Ticket staking for platform rewards
- **Governance**: DAO-based platform governance
- **Analytics**: Advanced event and user analytics
- **Mobile App**: Native mobile application
- **API Integration**: Third-party service integrations

### Scalability Improvements

- **Layer 2 Support**: Optimistic rollups and sidechains
- **Batch Operations**: Efficient bulk ticket operations
- **Caching**: Off-chain data caching for performance
- **Sharding**: Horizontal scaling for high-volume events

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: [Link to docs]
- **Discord**: [Link to Discord]
- **Telegram**: [Link to Telegram]
- **Email**: [Support email]

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- ZetaChain team for cross-chain infrastructure
- Hardhat team for development tools
- Community contributors and testers
