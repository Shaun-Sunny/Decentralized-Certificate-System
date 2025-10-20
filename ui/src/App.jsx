import React from "react";
import CertificateForm from "./CertificateForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🎓 Decentralized Certificate Verification
        </h1>

        <CertificateForm />

        <footer className="mt-8 text-center text-gray-500 text-sm">
          Powered by <span className="font-semibold text-blue-500">Ethereum + IPFS</span>
        </footer>
      </div>
    </div>
  );
}
