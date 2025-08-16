# ZetaChain Event Ticket Platform

A comprehensive, upgradeable NFT-based event ticket platform built on ZetaChain with cross-chain capabilities.

## Features

### 🎫 Core Ticketing
- **Event Creation**: Create events with customizable metadata (name, description, location, date/time, capacity)
- **Ticket Types**: Multiple ticket tiers (VIP, General, Student, etc.) with different pricing
- **Dynamic Pricing**: Time-based discounts and early bird pricing
- **Smart Contracts**: Fully upgradeable ERC721 contracts with OpenZeppelin standards

### 💰 Financial Features
- **Platform Fees**: Configurable platform and creator fee percentages
- **Automatic Payouts**: Instant payment distribution to event creators
- **Refund System**: Automated refunds for cancelled events
- **Cross-Chain Payments**: ZetaChain integration for multi-chain transactions

### 🔒 Security & Access Control
- **Role-Based Permissions**: Event creators, platform admins, and users
- **Reentrancy Protection**: Secure payment processing
- **Pausable Operations**: Emergency pause functionality
- **Ownership Controls**: Upgradeable contract management

### 🚀 Advanced Features
- **Secondary Marketplace**: Built-in ticket resale platform
- **Event Management**: Pause, resume, and cancel events
- **Analytics**: Event statistics and revenue tracking
- **Metadata Storage**: IPFS-compatible URI storage for ticket metadata

## Contract Architecture

### EventTicketPlatform.sol
Main contract handling:
- Event creation and management
- Ticket type configuration
- Purchase and refund logic
- Fee distribution
- Cross-chain integration

### TicketMarketplace.sol
Secondary market for:
- Ticket resales
- Price discovery
- Marketplace fees
- Secure transactions

## Quick Start

### 1. Deploy Contracts
```bash
npx hardhat run scripts/deploy-ticket-platform.js --network <network>
```

### 2. Create an Event
```javascript
// Create event
const eventId = await eventTicketPlatform.createEvent(
  "Summer Concert 2024",
  "Amazing summer concert",
  "Central Park, NY",
  startTime,
  endTime,
  1000
);

// Add ticket types
await eventTicketPlatform.addTicketType(
  eventId,
  "VIP",
  "VIP access with meet & greet",
  ethers.utils.parseEther("0.1"),
  100,
  discountStartTime,
  discountEndTime,
  ethers.utils.parseEther("0.08")
);
```

### 3. Purchase Tickets
```javascript
await eventTicketPlatform.purchaseTicket(
  eventId,
  ticketTypeId,
  "ipfs://QmTicketMetadata",
  { value: ticketPrice }
);
```

### 4. List on Marketplace
```javascript
// Approve marketplace
await eventTicketPlatform.approve(ticketMarketplace.address, tokenId);

// List ticket
await ticketMarketplace.listTicket(tokenId, resalePrice);
```

## Configuration

### Fee Structure
- **Platform Fee**: Default 5% (configurable)
- **Creator Fee**: Default 2% (configurable)
- **Marketplace Fee**: Default 2.5% (configurable)

### Network Support
- ZetaChain Mainnet
- ZetaChain Testnet
- Local development networks

## Testing

Run the comprehensive test suite:
```bash
npx hardhat test
```

## Security Considerations

- All contracts are upgradeable for future improvements
- Reentrancy protection on all payable functions
- Role-based access control for administrative functions
- Emergency pause functionality
- Comprehensive input validation

## Future Enhancements

- **QR Code Generation**: On-chain QR codes for ticket validation
- **Royalty System**: Automated royalty distribution for creators
- **Batch Operations**: Bulk ticket purchases and transfers
- **Advanced Analytics**: Detailed event performance metrics
- **Integration APIs**: Webhook support for external systems

## License

MIT License - see LICENSE file for details

## Support

For questions and support, please refer to the ZetaChain documentation or create an issue in this repository.
