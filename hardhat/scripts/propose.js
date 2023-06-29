const { ethers, network } = require("hardhat");
const { DealRequestStruct, PROPOSAL_DESCRIPTION, proposalsFile } = require("../helper-hardhat-config");
const fs = require("fs");

function storeProposalId(proposalId) {
    const chainId = network.config.chainId.toString();
    let proposals;
    try {
        const fileContent = fs.readFileSync(proposalsFile, "utf8");
        proposals = JSON.parse(fileContent);
      } catch (err) {
        console.error(`Error reading or parsing the proposalsFile: ${err.message}`);
        // You can initialize `proposals` with a default value if you'd like
        proposals = {};
      }
  // Ensure there is an array for the current chainId
    if (!proposals[chainId]) {
         proposals[chainId] = [];
     }

  proposals[chainId].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals), "utf8");
  }

    async function propose(args, functionToCall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract");
    const daoDealClient = await ethers.getContract("DaoDealClient");
    const encodedFunctionCall = daoDealClient.interface.encodeFunctionData(functionToCall, args);
    console.log(`Proposing ${functionToCall} on ${daoDealClient.address} with ${args}`);
    console.log(`Proposal Description:\n${proposalDescription}`);
    const proposeTx = await governor.propose(
        [daoDealClient.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
      )

    const proposeReceipt = await proposeTx.wait()
    const proposalId = proposeReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)
    const proposalState = await governor.state(proposalId)

    // save the proposalId
    storeProposalId(proposalId);

    // the Proposal State is an enum data type, defined in the IGovernor contract.
    // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    console.log(`Current Proposal State: ${proposalState}`)
}


    propose([DealRequestStruct], "makeDealProposal", PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
        })