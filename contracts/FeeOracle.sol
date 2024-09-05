// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FeeOracle is Ownable {
    uint24 public currentFee;
    address public authorizedUpdater;

    event FeeUpdated(uint24 newFee);
    event AuthorizedUpdaterChanged(address newUpdater);

    constructor(uint24 _initialFee) {
        currentFee = _initialFee;
        authorizedUpdater = msg.sender;
        // Ownership is automatically set to msg.sender in Ownable constructor
    }

    function updateFee(uint24 _newFee) external {
        require(msg.sender == authorizedUpdater, "Not authorized");
        require(_newFee >= 500 && _newFee <= 1000000, "Fee out of bounds"); // 0.05% to 100%
        currentFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function getFee() external view returns (uint24) {
        return currentFee;
    }

    function setAuthorizedUpdater(address _newUpdater) external onlyOwner {
        authorizedUpdater = _newUpdater;
        emit AuthorizedUpdaterChanged(_newUpdater);
    }
}