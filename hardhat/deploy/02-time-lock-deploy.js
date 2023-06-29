require("hardhat-deploy")
require("hardhat-deploy-ethers")


const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy } = deployments;

    const timeLock = await deploy("TimeLock", {
        from: wallet.address,
        args: [1, [], [], wallet.address],
        log: true,
    });
}