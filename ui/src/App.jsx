import React, { useEffect, useState } from "react";
import CertificateForm from "./CertificateForm.jsx";
import { provider, signer } from "./ethers.js";

export default function App() {
  const [account, setAccount] = useState("");

  // Fetch the signer address
  const fetchAccount = async () => {
    try {
      const address = await signer.getAddress();
      setAccount(address);
    } catch (err) {
      console.error("Error fetching account:", err);
      setAccount("Could not fetch account");
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Decentralized Certificate System</h1>
        <p className="text-gray-700">
          Connected account: <strong>{account}</strong>
        </p>
      </header>

      <CertificateForm />
    </div>
  );
}
