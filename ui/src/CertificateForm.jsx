import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { getContract } from "./ethers.js";

function toBytes32(str) {
  return ethers.encodeBytes32String(str);
}

export default function CertificateForm() {
  const [certName, setCertName] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("Please connect your wallet to begin.");
  const [certificateData, setCertificateData] = useState(null);

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

      const cid = res.data.Hash || (res.data.match(/Qm\\w+/) || [])[0];
      if (!cid) throw new Error("Could not parse IPFS CID.");

      setStatus(`✅ Uploaded to IPFS: ${cid}`);
      return cid;
    } catch (err) {
      setStatus("❌ IPFS upload failed: " + err.message);
      return null;
    }
  };

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
      setStatus("❌ Issue failed: " + err.message);
    }
  };

  const verifyCertificate = async () => {
    setStatus("⏳ Verifying certificate...");
    setCertificateData(null);

    try {
      const contract = getContract();
      const certId = toBytes32(certName);

      const cert = await contract.getCertificate(certId);
      if (!cert.issuer || cert.issuer === ethers.ZeroAddress) {
        setStatus("❌ Certificate not found on blockchain.");
        return;
      }

      if (!file) {
        setStatus("⚠️ Please select the certificate file to verify.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://127.0.0.1:5001/api/v0/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedCid = res.data.Hash || (res.data.match(/Qm\\w+/) || [])[0];
      if (!uploadedCid) {
        setStatus("❌ Could not compute IPFS hash of uploaded file.");
        return;
      }

      if (cert.ipfsCid.trim() !== uploadedCid.trim()) {
        setStatus("❌ Certificate file does NOT match blockchain record.");
        return;
      }

      setCertificateData({
        issuer: cert.issuer,
        ipfsCid: cert.ipfsCid,
        issuedAt: new Date(Number(cert.issuedAt) * 1000).toLocaleString(),
        valid: cert.valid,
      });

      setStatus("✅ Certificate successfully verified!");
    } catch (err) {
      setStatus("❌ Verification failed: " + err.message);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-indigo-100 transform transition-all duration-300 hover:scale-[1.01]">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Certificate Management
      </h2>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Enter certificate name (e.g., 'Graduation2023')"
          value={certName}
          onChange={(e) => setCertName(e.target.value)}
          className="border border-indigo-300 p-3 w-full rounded-lg bg-indigo-50 text-indigo-800 placeholder-indigo-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
        />

        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-indigo-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 transition duration-200 ease-in-out cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <button
          onClick={issueCertificate}
          className="w-full bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Issue
        </button>

        <button
          onClick={verifyCertificate}
          className="w-full bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Verify
        </button>
      </div>

      <p className="mt-8 text-md text-center p-3 bg-indigo-50 rounded-lg break-words text-indigo-700 border border-indigo-200 shadow-inner animate-fade-in delay-300">
        {status}
      </p>

      {certificateData && (
        <div className="mt-8 border-t border-indigo-200 pt-6 animate-fade-in delay-400">
          <h3
            className={`font-bold mb-3 text-xl ${
              certificateData.valid ? "text-green-700" : "text-red-700"
            } text-center`}
          >
            {certificateData.valid ? "✅ Valid Certificate" : "❌ Certificate Revoked"}
          </h3>

          <div className="space-y-2 text-md bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-md">
            <p>
              <strong>Issuer:</strong>{" "}
              <span className="font-mono text-sm text-gray-700">{certificateData.issuer}</span>
            </p>
            <p>
              <strong>IPFS CID:</strong>{" "}
              <span className="font-mono text-sm text-gray-700">{certificateData.ipfsCid}</span>
            </p>
            <p>
              <strong>Issued At:</strong>{" "}
              <span className="text-gray-700">{certificateData.issuedAt}</span>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
