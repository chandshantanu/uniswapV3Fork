# Uniswap V3 Fork with Dynamic Fee Model

This repository contains a fork of Uniswap V3 with a custom dynamic fee model implementation. The project aims to improve capital efficiency and adapt to market conditions by dynamically adjusting swap fees based on real-time market data.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Key Components](#key-components)
4. [Modifications to Uniswap V3](#modifications-to-uniswap-v3)
5. [Dynamic Fee Model](#dynamic-fee-model)
6. [Setup and Installation](#setup-and-installation)
7. [Deployment Process](#deployment-process)
8. [Testing](#testing)
9. [Integration with Off-chain Model](#integration-with-off-chain-model)
10. [Considerations and Challenges](#considerations-and-challenges)
11. [Future Improvements](#future-improvements)
12. [Contributing](#contributing)
13. [License](#license)

## Project Overview

This project extends Uniswap V3 by introducing a dynamic fee mechanism. Instead of fixed fee tiers, swap fees are calculated in real-time based on various market factors. This approach aims to optimize liquidity provision and trading efficiency across different market conditions.

## Repository Structure

```
uniswap-v3-fork/
├── contracts/
│   ├── core/  (modified Uniswap V3 core contracts)
│   ├── periphery/  (modified Uniswap V3 periphery contracts)
│   └── FeeOracle.sol
├── scripts/
│   └── deploy.js
├── test/
├── hardhat.config.js
└── .env
```

## Key Components

1. **FeeOracle Contract**: Implements the interface between on-chain contracts and off-chain fee calculations.
2. **Modified UniswapV3Pool**: Integrates with FeeOracle to use dynamic fees in swap calculations.
3. **Modified UniswapV3Factory**: Deploys pools with FeeOracle integration.
4. **Off-chain Dynamic Fee Model**: Python-based model for calculating optimal fees (separate repository).

## Modifications to Uniswap V3

### UniswapV3Pool.sol

- Added `FeeOracle` state variable and constructor parameter.
- Implemented `_getDynamicFee()` function to fetch current fee from FeeOracle.
- Modified `swap()` function to use dynamic fee in calculations.
- Updated other relevant functions (e.g., `flash()`) to use dynamic fees.

### UniswapV3Factory.sol

- Added `FeeOracle` address as a constructor parameter.
- Modified `createPool()` to deploy pools with FeeOracle reference.

### FeeOracle.sol

```solidity
contract FeeOracle {
    uint24 public currentFee;
    address public authorizedUpdater;

    function updateFee(uint24 _newFee) external {
        require(msg.sender == authorizedUpdater, "Not authorized");
        require(_newFee >= 500 && _newFee <= 1000000, "Fee out of bounds");
        currentFee = _newFee;
    }

    function getFee() external view returns (uint24) {
        return currentFee;
    }

    // Other necessary functions (e.g., setAuthorizedUpdater)
}
```

## Dynamic Fee Model

The dynamic fee model is implemented off-chain in a separate Python repository: [Dynamic Fee Model](https://github.com/chandshantanu/dynamicfeeModel.git)

Key features of the model:
- Analyzes real-time market data (price, volume, liquidity, volatility).
- Uses machine learning algorithms to predict optimal fee.
- Periodically calculates new fee and updates the on-chain FeeOracle.

## Setup and Installation

1. Clone the repository:
   ```
   git clone [Your Repository URL]
   cd uniswap-v3-fork
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in required variables (RPC URL, private key, contract addresses)

4. Compile contracts:
   ```
   npx hardhat compile
   ```

## Deployment Process

1. Deploy FeeOracle:
   ```
   npx hardhat run scripts/deploy.js --network arbitrumSepolia
   ```

2. Note the deployed addresses and update `.env` file.

3. Deploy Uniswap contracts (Factory, Router, etc.) using the same script.

4. Create initial liquidity pools as needed.

## Testing

Run tests using Hardhat:

```
npx hardhat test
```

Ensure to write comprehensive tests covering:
- FeeOracle functionality
- Dynamic fee integration in swaps
- Edge cases and potential vulnerabilities

## Integration with Off-chain Model

1. Set up the Python model from the [Dynamic Fee Model](https://github.com/chandshantanu/dynamicfeeModel.git) repository.
2. Configure the model to interact with the deployed FeeOracle contract.
3. Implement a service to run the model periodically and update fees.

## Considerations and Challenges

- Gas costs for frequent fee updates
- Ensuring model reliability and resistance to manipulation
- Balancing fee responsiveness with stability
- Maintaining compatibility with Uniswap V3 ecosystem

## Future Improvements

- Implement governance for fee model parameters
- Explore more sophisticated machine learning models
- Optimize gas usage for fee updates
- Expand to support multiple fee models for different market conditions

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any enhancements.

## License

This project is licensed under [Your Chosen License] - see the LICENSE file for details.