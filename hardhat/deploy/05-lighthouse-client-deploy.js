require("hardhat-deploy")
require("hardhat-deploy-ethers")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy, get } = deployments;

    const lighthouseClient = await deploy("LighthouseClient", {
        from: wallet.address,
        args: [],
        log: true,
    });

    //Transfer Ownership to Governor Contract
    //Comment this out after deploying the first time
    console.log("Transferring LighthouseClient Owner to Governor Contract")
    const lighthouseClientContract = await ethers.getContractAt("LighthouseClient", lighthouseClient.address)
    const governorContract = await get("GovernorContract");
    const transferOwnerTx = await lighthouseClientContract.transferOwnership(governorContract.address);
    await transferOwnerTx.wait();
    console.log("Ownership transferred");
}
