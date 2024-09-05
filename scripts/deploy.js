require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy FeeOracle
  const FeeOracle = await hre.ethers.getContractFactory("FeeOracle");
  const feeOracle = await FeeOracle.deploy(3000); // Initial fee of 0.3%
  await feeOracle.deployed();
  console.log("FeeOracle deployed to:", feeOracle.address);

  // Deploy UniswapV3Factory
  const UniswapV3Factory = await hre.ethers.getContractFactory("UniswapV3Factory");
  const factory = await UniswapV3Factory.deploy(feeOracle.address);
  await factory.deployed();
  console.log("UniswapV3Factory deployed to:", factory.address);

  // Get token addresses from .env
  const MOCK_WETH_ADDRESS = process.env.MOCK_WETH_ADDRESS;
  const MOCK_USDC_ADDRESS = process.env.MOCK_USDC_ADDRESS;
  const MOCK_DAI_ADDRESS = process.env.MOCK_DAI_ADDRESS;

  console.log("Using token addresses:");
  console.log("WETH:", MOCK_WETH_ADDRESS);
  console.log("USDC:", MOCK_USDC_ADDRESS);
  console.log("DAI:", MOCK_DAI_ADDRESS);

  // Create pools
  const FEE_0_3_PERCENT = 3000; // 0.3%
  const FEE_0_05_PERCENT = 500; // 0.05%

  // WETH-USDC Pool
  await factory.createPool(MOCK_WETH_ADDRESS, MOCK_USDC_ADDRESS, FEE_0_3_PERCENT);
  const wethUsdcPoolAddress = await factory.getPool(MOCK_WETH_ADDRESS, MOCK_USDC_ADDRESS, FEE_0_3_PERCENT);
  console.log("WETH-USDC Pool created at:", wethUsdcPoolAddress);

  // WETH-DAI Pool
  await factory.createPool(MOCK_WETH_ADDRESS, MOCK_DAI_ADDRESS, FEE_0_3_PERCENT);
  const wethDaiPoolAddress = await factory.getPool(MOCK_WETH_ADDRESS, MOCK_DAI_ADDRESS, FEE_0_3_PERCENT);
  console.log("WETH-DAI Pool created at:", wethDaiPoolAddress);

  // USDC-DAI Pool (with a different fee tier as an example)
  await factory.createPool(MOCK_USDC_ADDRESS, MOCK_DAI_ADDRESS, FEE_0_05_PERCENT);
  const usdcDaiPoolAddress = await factory.getPool(MOCK_USDC_ADDRESS, MOCK_DAI_ADDRESS, FEE_0_05_PERCENT);
  console.log("USDC-DAI Pool created at:", usdcDaiPoolAddress);

  console.log("Deployment and pool creation completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });