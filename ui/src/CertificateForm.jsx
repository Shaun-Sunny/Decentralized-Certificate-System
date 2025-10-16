import React, { useState } from "react";
import axios from "axios";
import { getContract } from "./ethers.js";
import { ethers } from "ethers";

function toBytes32(str) {
  const bytes = new TextEncoder().encode(str);
  if (bytes.length > 32) throw new Error("String too long for bytes32");
  const padded = new Uint8Array(32);
  padded.set(bytes);
  return ethers.hexlify(padded);
}


export default function CertificateForm() {
  const [file, setFile] = useState(null);
  const [certId, setCertId] = useState("");
  const [ipfsCid, setIpfsCid] = useState("");
  const [certificateData, setCertificateData] = useState(null);

  // --- UPLOAD TO IPFS ---
  const uploadToIPFS = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://127.0.0.1:5001/api/v0/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // IPFS returns JSON when using API; adjust for your setup
      const cid = res.data?.Hash || res.data; 
      if (!cid) return alert("❌ Could not parse CID from IPFS response");

      setIpfsCid(cid);
      alert(`✅ Uploaded to IPFS: ${cid}`);
    } catch (err) {
      console.error(err);
      alert("❌ IPFS Upload Failed");
    }
  };

  // --- ISSUE CERTIFICATE ---
  const issueCertificate = async () => {
    if (!ipfsCid) return alert("Please upload the file to IPFS first.");
    if (!certId) return alert("Please enter a certificate ID.");

    try {
      const contract = getContract();
      const tx = await contract.issueCertificate(toBytes32(certId), ipfsCid);
      await tx.wait();
      alert(`🎉 Certificate issued successfully! Tx: ${tx.hash}`);
    } catch (err) {
      console.error("Issue Certificate Error:", err);
      alert("❌ Failed to issue certificate");
    }
  };

  // --- VERIFY CERTIFICATE ---
  const verifyCertificate = async () => {
    if (!certId) return alert("Please enter the certificate ID to verify.");

    try {
      const contract = getContract();
      const data = await contract.getCertificate(toBytes32(certId));

      if (!data || data.issuer === "0x0000000000000000000000000000000000000000") {
        return alert("❌ Certificate not found or invalid");
      }

      setCertificateData({
        issuer: data.issuer,
        ipfsCid: data.ipfsCid,
        issuedAt: new Date(Number(data.issuedAt) * 1000).toLocaleString(),
        valid: data.valid,
      });
    } catch (err) {
      console.error("Verify Certificate Error:", err);
      alert("❌ Certificate not found or invalid");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center">🎓 Certificate Management</h2>

      <input
        type="text"
        placeholder="Enter certificate ID"
        value={certId}
        onChange={(e) => setCertId(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-4"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={uploadToIPFS}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload to IPFS
        </button>

        <button
          onClick={issueCertificate}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Issue Certificate
        </button>
      </div>

      <button
        onClick={verifyCertificate}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Verify Certificate
      </button>

      {certificateData && (
        <div className="mt-6 bg-gray-100 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">✅ Certificate Details:</h3>
          <p><strong>Issuer:</strong> {certificateData.issuer}</p>
          <p><strong>IPFS CID:</strong> {certificateData.ipfsCid}</p>
          <p><strong>Issued At:</strong> {certificateData.issuedAt}</p>
          <p><strong>Valid:</strong> {certificateData.valid ? "Yes" : "No"}</p>

          {certificateData.ipfsCid && (
            <a
              href={`https://ipfs.io/ipfs/${certificateData.ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 inline-block"
            >
              🔗 View Certificate on IPFS
            </a>
          )}
        </div>
      )}
    </div>
  );
}
