const { ethers } = require("hardhat")

const networkConfig = {
    314159: {
        name: "Calibration",
    },
    314: {
        name: "FilecoinMainnet",
    },
}

const extraParamsV1 = [
   'https://data-depot.lighthouse.storage/api/download/download_car?fileId=65e0bdfa-5fd3-4de7-ade1-045a8c7b353c.car',
    1439273,
    'true',
    'false',
]

const DealRequestStruct = [
    '0x000181e20392202007554549d24e42b38403cbd9d30d30299010c75e8473c4a131c6fa5b04267220',
    2097152,
    false,
    'bafybeicxcclvlid2ocrksh52lub3ny6vd3muic5etjppd2r7g6pcfdxufm',
    270000,
    700000,
    0,
    0,
    0, 
    1,
    extraParamsV1,
]

const proposalsFile = "proposals.json"

const PROPOSAL_DESCRIPTION = "Proposal #1 Store ATTAK_CAT!"

module.exports = {
    networkConfig,
    DealRequestStruct,
    proposalsFile,
    PROPOSAL_DESCRIPTION
}
