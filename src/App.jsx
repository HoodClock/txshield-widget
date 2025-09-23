import { useState } from "react";

export default function App() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanAddress = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const res = await fetch("https://your-api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to scan address" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">TxShield Scanner</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter contract/wallet address"
        className="border p-2 rounded w-80 mb-3"
      />
      <button
        onClick={scanAddress}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-white rounded shadow w-96">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p className="font-semibold">
                Safety Score: {result.safetyScore ?? "N/A"}
              </p>
              <ul className="list-disc ml-6 mt-2">
                {result.flags?.length > 0 ? (
                  result.flags.map((f, i) => <li key={i}>{f}</li>)
                ) : (
                  <li>No major risks detected</li>
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
