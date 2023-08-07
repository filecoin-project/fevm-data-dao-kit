import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios'
import pkg from 'hardhat'
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const { ethers, network } = pkg;

const PRIVATE_KEY = network.config.accounts[0];
const wallet = new ethers.Wallet(PRIVATE_KEY);
const address = wallet.address;

const signAuthMessage = async(privateKey, messageRequested) =>{
  const signer = new ethers.Wallet(privateKey);
  const signedMessage = await signer.signMessage(messageRequested);
  return(signedMessage)
}

const getApiKey = async() =>{
  const wallet = {
    publicKey: address, //>> Example: '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
    privateKey: PRIVATE_KEY
  }
  const verificationMessage = (
    await axios.get(
        `https://api.lighthouse.storage/api/auth/get_message?publicKey=${wallet.publicKey}`
    )
  ).data
  const signedMessage = await signAuthMessage(wallet.privateKey, verificationMessage)
  const response = await lighthouse.getApiKey(wallet.publicKey, signedMessage)
  console.log(response)
  const apiKey = response.data.apiKey;
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.join(dirname, '..', '..', '.env');
// Read the current content of the .env file
const envContent = fs.readFileSync(envPath, 'utf-8');

// Replace the existing API_KEY value or append a new one
const newEnvContent = envContent.includes('API_KEY=')
  ? envContent.replace(/API_KEY=.*/, `API_KEY="${apiKey}"`)
  : envContent + `\nAPI_KEY="${apiKey}"`;

// Write the updated content back to the .env file
fs.writeFileSync(envPath, newEnvContent);

}

getApiKey()
