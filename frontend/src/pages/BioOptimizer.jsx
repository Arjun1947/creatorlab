import { useEffect, useState } from "react";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard ✅");
};

const HISTORY_KEY = "creatorlab_bio_history";
const FAVORITES_KEY = "creatorlab_bio_favorites";

export default function BioOptimizer() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Professional");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🔹 Load history + favorites on page load
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // 🔹 Save history helper
  const saveToHistory = (entry) => {
    const updated = [entry, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  // ⭐ Toggle favorite
  const toggleFavorite = (bio) => {
    let updated;

    if (favorites.includes(bio)) {
      updated = favorites.filter((b) => b !== bio);
    } else {
      updated = [bio, ...favorites].slice(0, 10);
    }

    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const generateBio = async () => {
    if (!niche) {
      alert("Please enter your niche");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      console.log("API_URL:", API_URL);

      if (!API_URL) {
        alert("❌ VITE_API_URL missing! Please add it in frontend/.env");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/bio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, platform, tone }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Backend Error:", errText);
        alert(`❌ Backend Error: ${response.status}\n${errText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      const payload = {
        niche,
        platform,
        tone,
        bios: data.bios || [],
        time: new Date().toLocaleString(),
      };

      setResult(payload);
      saveToHistory(payload);
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      alert("❌ Backend not reachable / Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* MAIN */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold mb-6">Bio / Profile Optimizer</h2>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter niche (e.g. Fitness coach, Tech creator)"
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
        {result && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Optimized Bios</h3>
              <div className="space-y-3">
                {result.bios.map((bio, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start bg-white p-3 rounded border"
                  >
                    <span className="whitespace-pre-line">{bio}</span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(bio)}
                        className="text-sm bg-gray-900 text-white px-3 py-1 rounded"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => toggleFavorite(bio)}
                        className={`text-sm px-3 py-1 rounded border ${
                          favorites.includes(bio)
                            ? "bg-yellow-400"
                            : "bg-white"
                        }`}
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SIDE PANEL */}
      <div className="space-y-6">
        {/* HISTORY */}
        <div className="bg-gray-50 p-4 rounded border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Recent Bios</h3>

            {history.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem(HISTORY_KEY);
                  setHistory([]);
                  setResult(null);
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 && (
            <p className="text-sm text-gray-500">No history yet</p>
          )}

          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-white rounded border cursor-pointer hover:bg-gray-100"
                onClick={() => setResult(item)}
              >
                <p className="text-sm font-medium">{item.niche}</p>
                <p className="text-xs text-gray-500">
                  {item.platform} • {item.tone}
                </p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ⭐ FAVORITES */}
        <div className="bg-yellow-50 p-4 rounded border">
          <h3 className="text-lg font-semibold mb-3">⭐ Favorite Bios</h3>

          {favorites.length === 0 && (
            <p className="text-sm text-gray-500">No favorites yet</p>
          )}

          <div className="space-y-3">
            {favorites.map((bio, index) => (
              <div
                key={index}
                className="flex justify-between items-start bg-white p-3 rounded border"
              >
                <span className="text-sm whitespace-pre-line">{bio}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(bio)}
                    className="text-xs bg-gray-900 text-white px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => toggleFavorite(bio)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
