
## **Project Overview**

Create a modern, responsive Next.js frontend for a comprehensive NFT-based event ticket platform built on ZetaChain. The platform enables users to create, buy, sell, and transfer event tickets across multiple blockchain networks with cross-chain interoperability.

## **Core Requirements**

### **🎯 Technology Stack**

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand or Redux Toolkit
- **Web3 Integration**: wagmi + viem for Ethereum interactions
- **Blockchain**: ZetaChain integration with cross-chain support
- **Database**: Prisma + PostgreSQL (for off-chain data)
- **Authentication**: NextAuth.js with wallet connection
- **Deployment**: Vercel or similar

### **🏗️ Architecture Requirements**

- **Modular Design**: Component-based architecture with reusable UI components
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Performance**: Server-side rendering, image optimization, lazy loading
- **SEO**: Meta tags, structured data, sitemap generation
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support

## **📱 Core Features to Implement**

### **1. User Authentication & Wallet Integration**

- **Wallet Connection**: MetaMask, WalletConnect, Coinbase Wallet support
- **Multi-chain Support**: Ethereum, Polygon, BSC, Arbitrum, Optimism
- **User Profiles**: Dashboard with ticket history, events, and preferences
- **Session Management**: Persistent login with wallet signature verification

### **2. Event Discovery & Browsing**

- **Event Grid/List View**: Filterable by category, date, price, location
- **Search & Filters**:
  - Event categories (Concert, Sports, Conference, Theater, Festival, Exhibition)
  - Date range picker
  - Price range slider
  - Location-based search
  - Cross-chain availability
- **Event Cards**: Rich preview with images, pricing, capacity, organizer info
- **Pagination**: Infinite scroll or traditional pagination

### **3. Event Creation & Management (Organizers)**

- **Event Creation Wizard**:
  - Basic info (name, description, category, dates)
  - Venue details (name, address, capacity, seating map)
  - Ticket tier configuration (General, Premium, VIP)
  - Pricing strategy (base price + tier multipliers)
  - Cross-chain support selection
  - Image upload and media management
- **Event Dashboard**:
  - Sales analytics and metrics
  - Attendee management
  - Promo code creation and management
  - Event status updates (Created → Active → SoldOut/Cancelled/Completed)

### **4. Ticket Purchasing System**

- **Ticket Selection**: Choose tier, quantity, apply promo codes
- **Payment Flow**:
  - Multi-chain payment support
  - Gas fee estimation
  - Transaction confirmation
  - Receipt generation
- **Promo Code System**:
  - Code input with validation
  - Discount calculation display
  - Usage limits and expiration info
- **Purchase Confirmation**:
  - Ticket minting status
  - NFT metadata display
  - Transfer lock information (24-hour lock)

### **5. Secondary Market (Resale)**

- **Ticket Marketplace**: Browse available resale tickets
- **Listing Management**:
  - List tickets for resale
  - Set resale prices
  - Manage active listings
- **Purchase Flow**:
  - Resale ticket selection
  - Price comparison with original
  - Purchase confirmation
- **Transfer Lock Display**: Show remaining lock time

### **6. Cross-Chain Functionality**

- **Chain Selection**: Choose source and destination chains
- **Transfer Interface**:
  - Initiate cross-chain transfers
  - Gas fee estimation across chains
  - Transfer status tracking
- **Multi-chain Wallet Support**: Handle different wallet types per chain
- **Cross-chain Event Discovery**: Show events available on multiple chains

### **7. User Dashboard**

- **My Tickets**:
  - Active tickets with QR codes
  - Transfer history
  - Resale listings
- **My Events**:
  - Created events
  - Event management tools
  - Sales analytics
- **Transaction History**:
  - Purchase records
  - Transfer logs
  - Gas fee tracking
- **Wallet Management**:
  - Multi-chain wallet connections
  - Balance display per chain
  - Transaction signing

## **🎨 UI/UX Requirements**

### **Design System**

- **Color Palette**: Modern, accessible color scheme with dark/light mode
- **Typography**: Clear hierarchy with readable fonts
- **Icons**: Consistent icon set (Lucide React or Heroicons)
- **Animations**: Smooth transitions, loading states, micro-interactions
- **Responsive Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px+)

### **Key Pages & Components**

- **Landing Page**: Hero section, feature highlights, how it works
- **Event Browser**: Grid/list toggle, advanced filters, search
- **Event Detail**: Full event info, ticket selection, organizer details
- **Checkout Flow**: Multi-step process with progress indicator
- **User Dashboard**: Tabbed interface with sidebar navigation
- **Ticket Viewer**: NFT display, metadata, transfer options
- **Admin Panel**: Event management, analytics, user management

### **Interactive Elements**

- **Real-time Updates**: Live ticket availability, price changes
- **Notifications**: Transaction status, event reminders, price alerts
- **Social Features**: Event sharing, attendee lists, reviews
- **Mobile Optimization**: Touch-friendly interfaces, mobile-specific features

## **🔧 Technical Implementation**

### **Smart Contract Integration**

- **Contract ABI**: Use generated TypeScript types from Hardhat
- **Function Calls**:
  - `createEvent()`, `purchaseTicket()`, `listTicketForResale()`
  - `getEvent()`, `getTicket()`, `getUserEvents()`
  - Cross-chain transfer functions
- **Event Listening**: Real-time updates for ticket sales, transfers
- **Error Handling**: User-friendly error messages for contract failures

### **State Management**

- **Global State**: User authentication, wallet connection, network status
- **Local State**: Form data, UI state, temporary data
- **Caching**: Event data, user preferences, transaction history
- **Offline Support**: Basic functionality without internet connection

### **Data Flow**

- **API Routes**: Next.js API routes for off-chain operations
- **Database Schema**: Events, users, transactions, analytics
- **Real-time Updates**: WebSocket or Server-Sent Events for live data
- **Data Validation**: Client and server-side validation

## **📊 Advanced Features**

### **Analytics & Insights**

- **Event Analytics**: Sales trends, attendee demographics, revenue tracking
- **User Analytics**: Purchase patterns, favorite categories, engagement metrics
- **Platform Analytics**: Overall usage, popular events, cross-chain activity

### **Performance Optimization**

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Route-based and component-based splitting
- **Caching Strategy**: Redis for session data, CDN for static assets
- **Bundle Analysis**: Webpack bundle analyzer for optimization

### **Security & Compliance**

- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: API rate limiting for abuse prevention
- **Data Privacy**: GDPR compliance, data encryption
- **Audit Logging**: Track all user actions for security

## **🚀 Deployment & DevOps**

### **Environment Setup**

- **Development**: Local development with Hardhat local network
- **Staging**: ZetaChain testnet deployment
- **Production**: ZetaChain mainnet deployment

### **CI/CD Pipeline**

- **Automated Testing**: Unit tests, integration tests, E2E tests
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Deployment**: Automated deployment to staging/production
- **Monitoring**: Error tracking, performance monitoring, uptime alerts

## **📋 Deliverables**

### **Phase 1: Core MVP (Week 1-2)**

- Basic authentication and wallet connection
- Event browsing and ticket purchasing
- Simple user dashboard

### **Phase 2: Advanced Features (Week 3-4)**

- Event creation and management
- Secondary market functionality
- Cross-chain transfer interface

### **Phase 3: Polish & Optimization (Week 5-6)**

- Advanced analytics and insights
- Performance optimization
- Mobile app optimization
- Testing and bug fixes

## **🎯 Success Criteria**

- **Performance**: Lighthouse score >90 for all metrics
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile**: Responsive design with touch-optimized interfaces
- **Cross-browser**: Support for Chrome, Firefox, Safari, Edge
- **User Experience**: Intuitive navigation, clear CTAs, smooth interactions
- **Security**: Secure wallet integration, data protection, audit compliance

## **🔗 Integration Points**

- **ZetaChain RPC**: Mainnet and testnet endpoints
- **IPFS**: Metadata storage for NFTs
- **Analytics**: Google Analytics, Mixpanel, or similar
- **Payment**: Multi-chain wallet integration
- **Notifications**: Email, push notifications, in-app alerts

## **📚 Smart Contract Functions to Integrate**

### **Core Functions**

```solidity
// Event Management
function createEvent(string memory name, string memory description, EventCategory category, uint256 startTime, uint256 endTime, uint256 basePrice, uint256[] memory tierCapacities, uint256[] memory tierPrices) public returns (uint256)
function activateEvent(uint256 eventId) public
function cancelEvent(uint256 eventId) public

// Ticket Operations
function purchaseTicket(uint256 eventId, TicketTier tier, string memory promoCode) public payable returns (uint256)
function listTicketForResale(uint256 tokenId, uint256 resalePrice) public
function purchaseResaleTicket(uint256 tokenId) public payable

// View Functions
function getEvent(uint256 eventId) public view returns (...)
function getTicket(uint256 tokenId) public view returns (...)
function getEventTierInfo(uint256 eventId, TicketTier tier) public view returns (uint256 capacity, uint256 sold, uint256 price)
function getUserEvents(address user) public view returns (uint256[] memory)
function getUserTickets(address user) public view returns (uint256[] memory)

// Admin Functions
function createPromoCode(string memory code, uint256 discountPercentage, uint256 maxUses, uint256 validUntil) public onlyOwner
function setPlatformFeePercentage(uint256 newFeePercentage) public onlyOwner
function setPlatformTreasury(address newTreasury) public onlyOwner
```

### **Data Structures**

```solidity
enum TicketTier { General, Premium, VIP }
enum EventCategory { Concert, Sports, Conference, Theater, Festival, Exhibition, Other }
enum EventStatus { Created, Active, SoldOut, Cancelled, Completed }

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
```

## **🎨 Design Inspiration & References**

- **Modern E-commerce**: Ticketmaster, Eventbrite, SeatGeek
- **NFT Marketplaces**: OpenSea, Rarible, Magic Eden
- **DeFi Platforms**: Uniswap, Aave, Compound
- **Cross-chain Apps**: Multichain, Stargate, LayerZero

## **📱 Mobile-First Considerations**

- **Touch Interactions**: Large touch targets, swipe gestures
- **Performance**: Optimized for slower mobile networks
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Event reminders, price alerts
- **QR Code Integration**: Easy ticket validation and sharing

## **🔒 Security & Privacy**

- **Wallet Security**: Secure key management, transaction signing
- **Data Protection**: Encrypt sensitive user data
- **Audit Trail**: Log all user actions for compliance
- **Rate Limiting**: Prevent abuse and spam
- **Input Validation**: Sanitize all user inputs

---

**This frontend should provide a seamless, professional experience that makes blockchain-based ticket purchasing as simple as traditional e-commerce platforms while leveraging the unique benefits of cross-chain interoperability on ZetaChain.**

**Target Users**: Event organizers, ticket buyers, resellers, and platform administrators who want a modern, intuitive interface for managing and trading event tickets across multiple blockchain networks.
