task(
    "vote",
    "Vote on a proposal"
  )
    .addParam("proposalId", "The proposal to vote on")
    .addParam("vote", "Vote way 0 = Against, 1 = For, 2 = Abstain")
    .addParam("reason", "The reason to add it to the DAO")
    .setAction(async (taskArgs) => {

	const proposalId = taskArgs.proposalId
	const voteWay = taskArgs.vote
	const reason = taskArgs.reason
	await vote(proposalId, voteWay, reason)
    })

// 0 = Against, 1 = For, 2 = Abstain for this example
async function vote(proposalId, voteWay, reason) {
    console.log(`Voting ${voteWay} on ${proposalId} because ${reason}`)
    const governor = await ethers.getContract("GovernorContract")
    const voteTx = await governor.castVoteWithReason(proposalId, voteWay, reason)
    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.events[0].args.reason)
    const proposalState = await governor.state(proposalId)
    console.log(`Current Proposal State: ${proposalState}`)
}
