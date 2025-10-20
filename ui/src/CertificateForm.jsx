import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { getContract } from "./ethers.js";

// Helper: Convert string → bytes32
function toBytes32(str) {
  return ethers.encodeBytes32String(str);
}

export default function CertificateForm() {
  const [certName, setCertName] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [certificateData, setCertificateData] = useState(null);

  // ✅ Upload file to IPFS
  const uploadToIPFS = async () => {
    if (!file) {
      setStatus("⚠️ Please select a file first.");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://127.0.0.1:5001/api/v0/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const cid = res.data.Hash || (res.data.match(/Qm\w+/) || [])[0];
      if (!cid) throw new Error("Could not parse IPFS CID.");

      setStatus(`✅ Uploaded to IPFS: ${cid}`);
      return cid;
    } catch (err) {
      console.error("IPFS Upload Error:", err);
      setStatus("❌ IPFS upload failed: " + err.message);
      return null;
    }
  };

  // ✅ Issue certificate
  const issueCertificate = async () => {
    try {
      if (!file || !certName) {
        setStatus("⚠️ Please enter a certificate name and upload a file.");
        return;
      }

      setStatus("⏳ Uploading file to IPFS...");
      const cid = await uploadToIPFS();
      if (!cid) return;

      const contract = getContract();
      const certId = toBytes32(certName);

      const tx = await contract.issueCertificate(certId, cid);
      await tx.wait();

      setStatus(`🎉 Certificate issued successfully! Tx: ${tx.hash}`);
    } catch (err) {
      console.error("Issue Certificate Error:", err);
      setStatus("❌ Issue failed: " + err.message);
    }
  };

  // ✅ Verify certificate (name + file match)
  const verifyCertificate = async () => {
    setStatus("⏳ Verifying certificate...");
    setCertificateData(null);

    try {
      const contract = getContract();
      const certId = toBytes32(certName);

      // 1️⃣ Fetch on-chain record
      const cert = await contract.getCertificate(certId);
      if (!cert.issuer || cert.issuer === ethers.ZeroAddress) {
        setStatus("❌ Certificate not found on blockchain.");
        return;
      }

      // 2️⃣ Upload the provided file to IPFS for comparison
      if (!file) {
        setStatus("⚠️ Please select the certificate file to verify.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://127.0.0.1:5001/api/v0/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedCid = res.data.Hash || (res.data.match(/Qm\w+/) || [])[0];
      if (!uploadedCid) {
        setStatus("❌ Could not compute IPFS hash of uploaded file.");
        return;
      }

      // 3️⃣ Compare CID with the one on-chain
      if (cert.ipfsCid.trim() !== uploadedCid.trim()) {
        setStatus("❌ Certificate file does NOT match blockchain record.");
        return;
      }

      // 4️⃣ Display verified details
      setCertificateData({
        issuer: cert.issuer,
        ipfsCid: cert.ipfsCid,
        issuedAt: new Date(Number(cert.issuedAt) * 1000).toLocaleString(),
        valid: cert.valid,
      });

      setStatus("✅ Certificate successfully verified!");
    } catch (err) {
      console.error("Verify Certificate Error:", err);
      setStatus("❌ Verification failed: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">🎓 Certificate Issuer</h2>

      <input
        type="text"
        placeholder="Enter certificate name"
        value={certName}
        onChange={(e) => setCertName(e.target.value)}
        className="border p-2 w-full rounded mb-3"
      />

      <input
        id="fileInput"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 w-full rounded mb-3"
      />

      <div className="flex justify-between">
        <button
          onClick={issueCertificate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Issue Certificate
        </button>

        <button
          onClick={verifyCertificate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Verify Certificate
        </button>
      </div>

      <p className="mt-4 text-sm">{status}</p>

      {certificateData && (
        <div className="mt-5 border-t pt-4">
          <h3 className="font-semibold mb-2">✅ Certificate Details:</h3>
          <p><strong>Issuer:</strong> {certificateData.issuer}</p>
          <p><strong>IPFS CID:</strong> {certificateData.ipfsCid}</p>
          <p><strong>Issued At:</strong> {certificateData.issuedAt}</p>
          <p><strong>Valid:</strong> {certificateData.valid ? "Yes" : "No"}</p>

          <a
            href={`http://127.0.0.1:8080/ipfs/${certificateData.ipfsCid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline block mt-2"
          >
            🔗 View Certificate (Local IPFS Gateway)
          </a>
        </div>
      )}

      <p className="mt-5 text-xs text-gray-500 text-center">
        Powered by Ethereum + IPFS
      </p>
    </div>
  );
}
