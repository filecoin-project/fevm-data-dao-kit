const CID = require('cids');

task(
    "execute",
    "Execute a proposal"
  )
    .addParam("cid", "The piece CID of the data you want to add to the DAO")
    .addParam("reason", "The reason to add it to the DAO")
    .setAction(async (taskArgs) => {
	await execute(taskArgs.cid, taskArgs.reason);
    })
	
async function execute(cid, reason) {
    const strCID = cid
    const PROPOSAL_DESCRIPTION = reason

    const cidHexRaw = new CID(strCID).toString('base16').substring(1)
    const cidHex = "0x00" + cidHexRaw

    const args = [cidHex]
    const functionToCall = "storeCID"
    const lighthouseClient = await ethers.getContract("LighthouseClient")
    const encodedFunctionCall = lighthouseClient.interface.encodeFunctionData(functionToCall, args)
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

    const governor = await ethers.getContract("GovernorContract")

    console.log("Executing...")
    // this will fail on a testnet because you need to wait for the MIN_DELAY!
    const executeTx = await governor.execute(
	[lighthouseClient.address],
	[0],
	[encodedFunctionCall],
	descriptionHash
    )
    await executeTx.wait()
    console.log("Executed!")
}

