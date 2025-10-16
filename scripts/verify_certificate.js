const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Replace with your deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Cert = await ethers.getContractFactory("CertificateRegistry");
  const cert = Cert.attach(contractAddress);

  // Use the certificate ID from issuance
  const certId = "0x9cddfb0106c2c6b71e1978420e04b3e2c0e22b1f1a9c555e425f8faeaf43e45a";

  // Fetch certificate details
  const details = await cert.getCertificate(certId);

  console.log("Certificate details:");
  console.log(`Issuer: ${details.issuer}`);
  console.log(`IPFS CID: ${details.ipfsCid}`);
  console.log(`Issued at (timestamp): ${details.issuedAt}`);
  console.log(`Valid: ${details.valid}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
