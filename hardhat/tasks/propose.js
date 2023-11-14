const CID = require('cids');

task(
    "propose",
    "Proposes a CID to the DAO"
  )
    .addParam("cid", "The piece CID of the data you want to add to the DAO")
    .addParam("reason", "The reason to add it to the DAO")
    .setAction(async (taskArgs) => {

	const strCID = taskArgs.cid
	const PROPOSAL_DESCRIPTION = taskArgs.reason

	const cidHexRaw = new CID(strCID).toString('base16').substring(1)
	const cidHex = "0x00" + cidHexRaw

	await propose([cidHex], "storeCID", PROPOSAL_DESCRIPTION)

    })
	
async function propose(args, functionToCall, proposalDescription) {
    const governor = await ethers.getContract("GovernorContract");
    const lighthouseClient = await ethers.getContract("LighthouseClient");
    const encodedFunctionCall = lighthouseClient.interface.encodeFunctionData(functionToCall, args);
    console.log(`Proposing ${functionToCall} on ${lighthouseClient.address} with ${args}`);
    console.log(`Proposal Description:\n${proposalDescription}`);
    const proposeTx = await governor.propose(
        [lighthouseClient.address],
        [0],
        [encodedFunctionCall],
        proposalDescription
      )

    const proposeReceipt = await proposeTx.wait()
    const proposalId = proposeReceipt.events[0].args.proposalId
    console.log(`Proposed with proposal ID:\n  ${proposalId}`)
    const proposalState = await governor.state(proposalId)

    // the Proposal State is an enum data type, defined in the IGovernor contract.
    // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    console.log(`Current Proposal State: ${proposalState}`)
}
