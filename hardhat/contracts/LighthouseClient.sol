// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Deal {
       // A unique identifier for the deal.
       uint64 dealId;
       // The miner that is storing the data for the deal.
       uint64 minerId;
}

interface IExternalContract {
    function submit(bytes memory _cid) external returns (uint256);
    function submitRaaS(
        bytes memory _cid,
        uint256 _replication_target,
        uint256 _repair_threshold,
        uint256 _renew_threshold
    ) external returns (uint256);
    function getAllDeals(bytes memory _cid) external view returns (Deal[] memory);
}

contract LighthouseClient is Ownable {
    address constant externalContractAddress = 0x01ccBC72B2f0Ac91B79Ff7D2280d79e25f745960;

    function storeCID(bytes memory cid) public onlyOwner {
        IExternalContract(externalContractAddress).submitRaaS(cid, 1, 1, 1);
    }

    function getDealByCID(bytes memory cid) external view returns (Deal[] memory) {
    	return IExternalContract(externalContractAddress).getAllDeals(cid);
    }
}

