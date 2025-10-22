// ethers.js
import { ethers } from "ethers";

// Connect to Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use the first default Hardhat account
const privateKey =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const signer = new ethers.Wallet(privateKey, provider);

// Replace with your most recent deployed contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const abi = [
  "function issueCertificate(bytes32 certId, string ipfsCid) external",
  "function getCertificate(bytes32 certId) external view returns (address issuer, string ipfsCid, uint256 issuedAt, bool valid)",
  "event CertificateIssued(bytes32 indexed certId, address indexed issuer, string ipfsCid, uint256 issuedAt)"
];

export function getContract() {
  return new ethers.Contract(contractAddress, abi, signer);
}