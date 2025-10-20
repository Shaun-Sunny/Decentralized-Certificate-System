// src/ethers.js
import { ethers } from "ethers";

// Local Hardhat provider
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Default Hardhat private key (account #0)
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const signer = new ethers.Wallet(privateKey, provider);

// ⚠️ Replace this address with your actual deployed contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function issueCertificate(bytes32 certId, string ipfsCid) public",
  "function getCertificate(bytes32 certId) public view returns (address issuer, string ipfsCid, uint256 issuedAt, bool valid)",
];

export function getContract() {
  return new ethers.Contract(contractAddress, abi, signer);
}

// ✅ Export provider and signer if App.jsx needs them
export { provider, signer };
