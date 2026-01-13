import { useState } from "react";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard ✅");
};

export default function BioOptimizer() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Professional");
  const [bios, setBios] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateBio = async () => {
    if (!niche) {
      alert("Please enter your niche");
      return;
    }

    setLoading(true);
    setBios([]);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/bio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, tone }),
      });

      const data = await response.json();

      setBios(data.bios || []);
    } catch (error) {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Bio / Profile Optimizer</h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter niche (e.g. Fitness coach)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="border p-3 rounded"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border p-3 rounded"
        >
          <option>Instagram</option>
          <option>YouTube</option>
        </select>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="border p-3 rounded"
        >
          <option>Professional</option>
          <option>Funny</option>
          <option>Motivational</option>
        </select>
      </div>

      {/* Button */}
      <button
        onClick={generateBio}
        disabled={loading}
        className={`px-6 py-3 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-900 hover:bg-gray-700"
        }`}
      >
        {loading ? "Generating..." : "Generate Bio"}
      </button>

      {/* Output */}
      {bios.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold">Optimized Bios</h3>

          {bios.map((bio, index) => (
            <div
              key={index}
              className="flex justify-between items-start bg-white p-4 rounded border gap-4"
            >
              <p className="whitespace-pre-line flex-1">{bio}</p>

              <button
                onClick={() => copyToClipboard(bio)}
                className="bg-gray-900 text-white px-4 py-2 rounded"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
