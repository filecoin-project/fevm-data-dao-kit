import React, { useState, useEffect } from "react";
import governorContractABI from "../contractABIs/governorABI.json";
import daoDealClientABI from "../contractABIs/daoDealClientABI.json";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { ethers } from "ethers";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Spinner from 'react-bootstrap/Spinner';
const CID = require("cids");

 // Replace this address with the address of own instance of the deal client contract
const governorContractAddress = "0xb57724c0cB71C4a9a967c586CcF54d2Da8234028";
const daoDealClientAddress = "0x116de3162285EaD343E9C88b5c5d101596930128";
let governor;
let cid;

function Inputs() {
  // Initialize with some dummy working default values
  const [commP, setCommP] = useState(
    "baga6ea4seaqkp2pjlh6avlvee6ib2maanav5sc35l5glf3zm6rd6hmfgcx5xeji"
  );
  const [carLink, setCarLink] = useState(
    "https://data-depot.lighthouse.storage/api/download/download_car?fileId=862fb115-d24a-4ff1-a1c8-eadbbbfd19cf.car"
  );
  const [errorMessageSubmit, setErrorMessageSubmit] = useState("");
  const [pieceSize, setPieceSize] = useState("32768");
  const [carSize, setCarSize] = useState("18445");
  const [proposalDescription, setProposalDescription] = useState("Test Proposal Description");
  const [txSubmitted, setTxSubmitted] = useState("");
  const [dealID, setDealID] = useState("");
  const [proposingDeal, setProposingDeal] = useState(false);
  const [network, setNetwork] = useState("");

  const handleChangeCommP = (event) => {
    setCommP(event.target.value);
  };

  const handleChangeCarLink = (event) => {
    // validate input data here
    setCarLink(event.target.value);
  };

  const handleChangePieceSize = (event) => {
    setPieceSize(event.target.value);
  };

  const handleChangeCarSize = (event) => {
    setCarSize(event.target.value);
  };

  const handleChangeProposalDescription = (event) => {
    setProposalDescription(event.target.value);
  };


  const handleSubmit = async (event) => {
    // This will be handling deal proposal submission sometime in the future.
    event.preventDefault();
    // do something with the carLink value, like send it to a backend API
    console.log(commP);
    console.log(carLink);
    console.log(pieceSize);
    console.log(carSize);

    try {
      setErrorMessageSubmit(
        ""
      );
      cid = new CID(commP);
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        governor = new ethers.Contract(
          governorContractAddress,
          governorContractABI,
          signer
        );
        const extraParamsV1 = [
          carLink,
          carSize,
          false, // taskArgs.skipIpniAnnounce,
          false, // taskArgs.removeUnsealedCopy
        ];
        const DealRequestStruct = [
          cid.bytes, //cidHex
          pieceSize, //taskArgs.pieceSize,
          false, //taskArgs.verifiedDeal,
          commP, //taskArgs.label,
          520000, // startEpoch
          1555200, // endEpoch
          0, // taskArgs.storagePricePerEpoch,
          0, // taskArgs.providerCollateral,
          0, // taskArgs.clientCollateral,
          1, //taskArgs.extraParamsVersion,
          extraParamsV1,
        ];
        // console.log(await provider.getBalance("0x42c930a33280a7218bc924732d67dd84d6247af4"));
        console.log(governor.interface);
        const encodedFunctionCall = 
        daoDealClientABI.encodeFunctionData("makeDealProposal", [DealRequestStruct]);
        const transaction = await governor.propose(
          [daoDealClientAddress],
          [0],
          [encodedFunctionCall],
          proposalDescription
        );
        console.log("Proposing deal to DAO...");
        setProposingDeal(true);
        const receipt = await transaction.wait();
        console.log(receipt);
        setProposingDeal(false);
        setTxSubmitted("Transaction submitted! " + receipt.hash);

        governor.on("DealProposalCreate", (id, size, verified, price)=>{
          console.log(id, size, verified, price);
        })

        console.log("Deal proposed! CID: " + cid);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setErrorMessageSubmit(
        "Something went wrong. " + error.name + " " + error.message
      );
      return;
    }
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const provider = new ethers.BrowserProvider(ethereum);
    const network = await provider.getNetwork();
    setNetwork(network.chainId);
    console.log(network.chainId);

    ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an account:", account);
      } else {
        console.log("No account found");
      }
    });
  };

  const connectWalletHandler = () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        console.log("Connected", accounts[0]);
      })
      .catch((err) => console.log(err));
  };

  const connectWalletButton = () => {
    return (
      <div style={{ display: "flex" }}> <div class="child-1-cw"> 
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
      { window && <div style={{ color: "green" }}> Connected </div>}
      { network && <div style={{ color: "green" }}> Network: Calibration </div>}
      </div></div>
    );
  };

  const dealIDButton = () => {
    return (
      <button
        onClick={dealIDHandler}
      >
        Get deal ID
      </button>
    );
  };

  const dealIDHandler = async () => {
    setDealID("Waiting for acceptance by SP...");
    cid = new CID(commP);
    var refresh = setInterval(async () => {
        console.log(cid.bytes);
        if (cid === undefined) {
          setDealID("Error: CID not found");
          clearInterval(refresh);
        }
        console.log("Checking for deal ID...");
        const dealID = await governor.pieceDeals(cid.bytes);
        console.log(dealID);
        if (dealID !== undefined && dealID !== "0") {
          // If your deal has already been submitted, you can get the deal ID by going to https://calibration.filfox.info/en/deal/<dealID>
          // The link will show up in the frontend: once a deal has been submitted, its deal ID stays constant. It will always have the same deal ID.
          setDealID("https://calibration.filfox.info/en/deal/" + dealID);
          clearInterval(refresh);
        }
      }, 5000
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    
    <div id="container"> 
    <h1>
      Basic DataDAO FrontEnd
    </h1>
      <div style={{ display: "flex" }}> <div class="child-1-cw"> 
        {connectWalletButton()}
      </div></div>

      <form class="child-1"  onSubmit={handleSubmit}>

        <div class='child-1-hg'>

        <label>
          Link to CAR file
        </label>


        <div>
          <div class="tooltip"
            data-tooltip-id="carfile-tooltip"
            data-tooltip-delay-hide={50}
            data-tooltip-html=" Find a URL to your car file by going to data.fvm.dev and uploading your file (site in development). <br /> You can also go to tech-greedy/generate-car and upload the resulting car file to web3.storage."
          >
            <AiOutlineQuestionCircle />
          </div>
          <Tooltip id="carfile-tooltip" />
        </div>


        </div>


          <input class="input-elem"
            type="text"
            value={carLink}
            onChange={handleChangeCarLink}
          />
        
        <br />
        <br />

        <div class='child-1-hg'>

        <label> commP </label>

            <div
              class="tooltip"
              data-tooltip-id="commp-tooltip"
              data-tooltip-delay-hide={50}
              data-tooltip-html="This is also known as the Piece CID. <br /> You can go to data.fvm.dev and get this by uploading your file (site in development). <br />This also can be accessed as the output of tech-greedy/generate-car."
            >
              <AiOutlineQuestionCircle />
            </div>
            <Tooltip id="commp-tooltip" />

        </div>

          <input class="input-elem"
            type="text"
            value={commP}
            onChange={handleChangeCommP}
          />


        <br />
        <br />

        <div class='child-1-hg'>

        <label>
          Piece Size:
        </label>

        <div
          class="tooltip"
          data-tooltip-id="piecesize-tooltip"
          data-tooltip-delay-hide={50}
          data-tooltip-html="This is the number of bytes of your Piece (you can read more about Filecoin Pieces in the spec). <br /> You can go to data.fvm.dev and get this by uploading your file (site in development).<br /> This also can be accessed as the output of tech-greedy/generate-car."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="piecesize-tooltip" />


        </div>

          <input class="input-elem"
            type="text"
            value={pieceSize}
            onChange={handleChangePieceSize}
          />
        <br />
        <br />

        

       <input class="input-elem" type="text" value={carSize} onChange={handleChangeCarSize} />

        <br />
        <br />

        <div class='child-1-hg'>

        <label>
          Proposal Description:
        </label>

        <div
          class="tooltip"
          data-tooltip-id="proposal-description-tooltip"
          data-tooltip-delay-hide={50}
          data-tooltip-html="This is the description of the proposal you are making to the DAO."
        >
          <AiOutlineQuestionCircle />
        </div>
        <Tooltip id="proposal-description-tooltip" />


        </div>

        

       <input class="input-elem" type="text" value={proposalDescription} onChange={handleChangeProposalDescription} />
        <br />
        <br />
        <button
          type="submit"
          style={{ display: "block", width: "50%", margin: "auto" }}
        >
          Propose
        </button>
        <div style={{ color: "red" }}> {errorMessageSubmit} </div>
        { proposingDeal && <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>}
        <div style={{ color: "green" }}> {txSubmitted} </div>
      </form>

      <br />
      <br />
    

    </div>
  );
}

export default Inputs;