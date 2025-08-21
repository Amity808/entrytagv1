# ZetaChain NFT Ticket Platform

## 🎫 Project Overview

A decentralized NFT ticket platform built on ZetaChain that enables event organizers to create, sell, and manage NFT-based event tickets on the blockchain. This platform leverages the power of Web3 to provide secure, transparent, and verifiable ticketing solutions.

## 🚀 Key Features

### **Event Management**

- **Create Events**: Organizers can create events with customizable details (name, description, category, dates, location, pricing)
- **IPFS Integration**: Event metadata and images are stored on IPFS for decentralized storage
- **Smart Contract Backend**: All events are managed through ZetaChain smart contracts

### **NFT Ticketing**

- **Universal NFT Support**: Built on ZetaChain's Universal NFT standard for cross-chain compatibility
- **Automated Minting**: Tickets are automatically minted as NFTs when purchased which can be mint across chain.
- **Verifiable Ownership**: Each ticket is a unique NFT with verifiable blockchain ownership

### **User Experience**

- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Wallet Integration**: Seamless MetaMask and other Web3 wallet connections
- **Real-time Updates**: Live data from blockchain with instant UI updates

## 🏗️ Technical Architecture

### **Frontend**

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context for real-time data
- **Web3 Integration**: Wagmi hooks for blockchain interactions

### **Smart Contracts**

- **Platform**: ZetaChain (Athens testnet)
- **Language**: Solidity with OpenZeppelin contracts
- **Features**: Upgradeable contracts with Universal NFT support
- **Security**: Role-based access control and pause functionality

### **Data Storage**

- **On-Chain**: Event structure, ticket ownership, and transaction history
- **IPFS**: Event metadata, descriptions, and images
- **Real-time**: Live contract data fetching and filtering

## 🔧 Core Functionality

### **Event Creation Flow**

1. Organizer connects wallet and fills event form
2. Event metadata uploaded to IPFS
3. Smart contract creates event with IPFS metadata URI
4. Event appears in platform with real-time data

### **Ticket Purchase Flow**

1. User browses available events
2. Selects event and quantity
3. Confirms purchase through wallet
4. NFT ticket minted to user's address
5. Transaction recorded on blockchain

### **Search & Discovery**

- **Real-time Search**: Filter events by name, description, category
- **Category Filtering**: Concert, Sports, Conference, Theater, Festival, Exhibition
- **Price Range Filtering**: Dynamic pricing based on ZETA token values
- **Live Updates**: Search results update as events are created

## 🌐 Blockchain Features

### **ZetaChain Integration**

- **Cross-chain Compatibility**: Universal NFT standard for multi-chain support
- **Gas Optimization**: Efficient transaction handling
- **Testnet Support**: Athens testnet for development and testing

### **Smart Contract Functions**

- `create_ticket()`: Create new events
- `events()`: Fetch event details
- `_nextEventId`: Get total event count
- `purchaseTicket()`: Buy NFT tickets

## 🎯 Use Cases

### **Event Organizers**

- **Concert Promoters**: Create and sell NFT concert tickets
- **Sports Teams**: Issue verifiable game tickets
- **Conference Hosts**: Manage attendee registrations
- **Festival Organizers**: Handle large-scale event ticketing

### **Event Attendees**

- **Secure Ownership**: Verifiable NFT ticket ownership
- **Transferable**: Sell or gift tickets to others
- **Transparent**: All transaction history on blockchain
- **No Counterfeits**: Each ticket is a unique, verifiable NFT

## 🚀 Getting Started

### **Prerequisites**

- MetaMask or Web3 wallet
- ZETA tokens for gas fees
- Athens testnet configuration

### **Installation**

```bash
npm install
npm run dev
```

### **Configuration**

- Set up ZetaChain Athens testnet
- Configure contract addresses
- Set up IPFS gateway

## 🔮 Future Enhancements

- **Secondary Market**: Built-in ticket resale platform
- **Royalty System**: Automatic royalties for organizers
- **Multi-chain Support**: Expand to other blockchain networks
- **Mobile App**: Native mobile application
- **Analytics Dashboard**: Event performance metrics
- **Social Features**: Event sharing and discovery

## 🤝 Contributing

This is an open-source project built for the ZetaChain hackathon. Contributions are welcome!

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the ZetaChain ecosystem**
