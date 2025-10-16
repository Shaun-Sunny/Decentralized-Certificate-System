async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const Cert = await ethers.getContractFactory("CertificateRegistry");
  const cert = await Cert.deploy();
  await cert.deployed();

  console.log("CertificateRegistry deployed at:", cert.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
