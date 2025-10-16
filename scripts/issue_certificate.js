const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [issuer] = await ethers.getSigners();

  // Replace with your deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Cert = await ethers.getContractFactory("CertificateRegistry");
  const cert = Cert.attach(contractAddress);

  // Generate a certificate ID (could be a hash of student+course)
  const certId = ethers.utils.id("JohnDoe-BlockchainFundamentals");

  // IPFS CID from Step 4
  const ipfsCid = "QmSt5kLBfEssktBonp59eV8MuKbiozYaLoDYPSPkUvzMxy";

  // Issue the certificate
  const tx = await cert.issueCertificate(certId, ipfsCid);
  await tx.wait();

  console.log(`Certificate issued! ID: ${certId}`);
  console.log(`IPFS CID stored: ${ipfsCid}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

