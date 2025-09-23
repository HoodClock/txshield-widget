import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://api.txshield.xyz";

export default function App() {
  const [contractAddress, setContractAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanChecks = async () => {

    // dummy walllet user address
    const defaultUserAddress = "0xB1e956559DdeC211345076eba41a3bEF32923b66"
    const defaultAmount = 0.01

    setLoading(true);

    const formData = {
      address: contractAddress,
      userAddress: defaultUserAddress,
      contractAddress,
      tokenAddress: contractAddress,
      recepientAddress: contractAddress,
      value: defaultAmount,
      currencySymbol: "ETH",
    };

    try {
      const honeypotRes = await axios.post(
        `${BASE_URL}/api/honeypot/honeypot-checks`,
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      const phishingRes = await axios.post(
        `${BASE_URL}/api/phishing/phishing-checks`,
        formData,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setResult({
        honeypotScore: honeypotRes.data?.totalScore ?? "N/A",
        phishingScore: phishingRes.data?.phishingScore ?? "N/A",
      });
    } catch (err) {
      setResult({ error: "Failed to fetch scores" });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          TxShield Widget
        </h1>
        <input
          type="text"
          placeholder="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="border border-gray-600 bg-gray-900 text-white p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={scanChecks}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan Now"}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
            {result.error ? (
              <p className="text-red-400 text-center">{result.error}</p>
            ) : (
              <>
                <p className="font-semibold text-white">
                  Honeypot Score:{" "}
                  <span className="text-blue-400">{result.honeypotScore}</span>
                </p>
                <p className="font-semibold text-white mt-3">
                  Phishing Score:{" "}
                  <span className="text-blue-400">{result.phishingScore}</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
