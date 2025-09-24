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

    <div className="widget-container">
      <div className="widget-card">
        <h1 className="widget-title">⚡ TxShield Widget</h1>

        <input
          type="text"
          placeholder="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="widget-input"
        />

        <button onClick={scanChecks} disabled={loading} className="widget-button">
          {loading ? "⚙️ Scanning..." : "🚀 Scan Now"}
        </button>

        {result && (
          <div className="widget-result">
            {result.error ? (
              <p className="error-text">❌ {result.error}</p>
            ) : (
              <>
                <p className="result-text">
                  🛡 Honeypot Score: <span className="highlight">{result.honeypotScore}</span>
                </p>
                <p className="result-text">
                  🎭 Phishing Score: <span className="highlight">{result.phishingScore}</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

}
