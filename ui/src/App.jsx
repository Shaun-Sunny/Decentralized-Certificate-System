import React from "react";
import CertificateForm from "./CertificateForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6 sm:p-10 font-sans">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 animate-fade-in-down">
            🎓 Decentralized Certificate
          </h1>
          <p className="text-purple-700 mt-3 text-lg animate-fade-in-up delay-100">
            Issue and Verify with Blockchain & IPFS
          </p>
        </div>

        {/* Certificate Form */}
        <CertificateForm />

        {/* Footer */}
        <footer className="mt-10 text-center text-indigo-500 text-sm opacity-80 animate-fade-in-up delay-200">
          Powered by <span className="font-semibold text-purple-600">Ethereum + IPFS</span>
        </footer>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}
