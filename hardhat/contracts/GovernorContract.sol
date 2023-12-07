// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";

contract GovernorContract is Governor, GovernorCountingSimple, GovernorVotes {
    constructor(IVotes _token) Governor("MyGovernor") GovernorVotes(_token) {}

    function votingDelay() public pure override returns (uint256) {
        return 0; // 0 days
    }

    function votingPeriod() public pure override returns (uint256) {
        return 6; // 3 minutes
    }

    function quorum(uint256) public pure override returns (uint256) {
        return 1e18;
    }
}
