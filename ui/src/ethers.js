// ethers.js
import { ethers } from "ethers";

// Connect to local Hardhat node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use Hardhat's first default account as signer
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account[0]

const signer = new ethers.Wallet(privateKey, provider);

// Replace this with your deployed contract address
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

// Minimal ABI for CertificateRegistry contract
const abi = [
  "function issueCertificate(bytes32 certId, string ipfsCid) public",
  "function getCertificate(bytes32 certId) public view returns (address issuer, string ipfsCid, uint256 issuedAt, bool valid)"
];

// Function to get contract instance with signer
function getContract() {
  return new ethers.Contract(contractAddress, abi, signer);
}

export { provider, signer, getContract };
