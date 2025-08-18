import { expect } from "chai";
import pkg from "hardhat";
const { ethers, upgrades } = pkg;

describe("EventTicketPlatform", function () {
  let eventPlatform;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const EventTicketPlatform = await ethers.getContractFactory(
      "EventTicketPlatform"
    );

    eventPlatform = await upgrades.deployProxy(EventTicketPlatform, [
      owner.address, // initialOwner
      "EventTicketPlatform", // name
      "ETP", // symbol
      "0x0000000000000000000000000000000000000000", // gatewayAddress (placeholder)
      300000, // gas
      "0x0000000000000000000000000000000000000000", // uniswapRouterAddress (placeholder)
      500, // platformFeePercentage (5%)
      owner.address, // platformTreasury
    ]);

    await eventPlatform.waitForDeployment();
  });

  it("Should deploy successfully", async function () {
    expect(await eventPlatform.name()).to.equal("EventTicketPlatform");
    expect(await eventPlatform.symbol()).to.equal("ETP");
    expect(await eventPlatform.owner()).to.equal(owner.address);
  });

  it("Should allow owner to create an event", async function () {
    const eventName = "Test Event";
    const eventDescription = "A test event";
    const startTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
    const endTime = startTime + 3600; // 1 hour later
    const basePrice = ethers.utils.parseEther("0.1");
    const tierCapacities = [100, 50, 25]; // General, Premium, VIP
    const tierPrices = [
      ethers.utils.parseEther("0.1"),
      ethers.utils.parseEther("0.2"),
      ethers.utils.parseEther("0.5"),
    ];

    await eventPlatform.createEvent(
      eventName,
      eventDescription,
      0, // Concert category
      startTime,
      endTime,
      basePrice,
      tierCapacities,
      tierPrices,
      false // isCrossChain
    );

    // Check if event was created
    const event = await eventPlatform.getEvent(1);
    expect(event.name).to.equal(eventName);
    expect(event.description).to.equal(eventDescription);
  });
});
