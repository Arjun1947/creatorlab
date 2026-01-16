import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard ✅");
};

const HISTORY_KEY = "creatorlab_history";
const FAVORITES_KEY = "creatorlab_favorites";

export default function CaptionGenerator() {
  const { user } = useAuth(); // ✅ logged-in user check

  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Motivational");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load local history + favorites for guests
  useEffect(() => {
    if (!user) {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);

      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    }
  }, [user]);

  // Local history save
  const saveToHistoryLocal = (entry) => {
    const updated = [entry, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  // Local favorite toggle
  const toggleFavoriteLocal = (caption) => {
    let updated;
    if (favorites.includes(caption)) {
      updated = favorites.filter((c) => c !== caption);
    } else {
      updated = [caption, ...favorites].slice(0, 10);
    }

    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  // Save result to MongoDB (logged-in)
  const saveToHistoryCloud = async (payload) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}/api/data/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        type: "caption",
        input: { topic: payload.topic, tone: payload.tone, platform: payload.platform },
        result: { captions: payload.captions, hashtags: payload.hashtags },
      }),
    });

    return res.json();
  };

  const generateContent = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/caption`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, platform }),
      });

      const data = await response.json();

      const payload = {
        topic,
        tone,
        platform,
        captions: data.captions || [],
        hashtags: data.hashtags || [],
        time: new Date().toLocaleString(),
      };

      setResult(payload);

      // ✅ Guest → localStorage
      if (!user) {
        saveToHistoryLocal(payload);
      }

      // ✅ Logged-in → MongoDB
      if (user) {
        await saveToHistoryCloud(payload);
      }
    } catch (error) {
      alert("Backend not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* MAIN */}
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold mb-2">Caption & Hashtag Generator</h2>

        {!user && (
          <p className="text-sm text-gray-500 mb-6">
            You are in Guest Mode. Login to save results online.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter topic (e.g. Gym motivation)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border p-3 rounded"
          >
            <option>Instagram</option>
            <option>YouTube Shorts</option>
          </select>

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border p-3 rounded"
          >
            <option>Motivational</option>
            <option>Funny</option>
            <option>Professional</option>
          </select>
        </div>

        <button
          onClick={generateContent}
          disabled={loading}
          className={`px-6 py-3 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-700"
          }`}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {result && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Captions</h3>
              <div className="space-y-3">
                {result.captions.map((cap, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-3 rounded border"
                  >
                    <span>{cap}</span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(cap)}
                        className="text-sm bg-gray-900 text-white px-3 py-1 rounded"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => {
                          if (!user) {
                            toggleFavoriteLocal(cap);
                          } else {
                            alert("⭐ Favorites for logged-in users will be saved in cloud (next step)");
                          }
                        }}
                        className="text-sm px-3 py-1 rounded border bg-white"
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Hashtags</h3>
              <div className="bg-gray-100 p-4 rounded flex justify-between items-start gap-4">
                <p className="flex-1">{result.hashtags.join(" ")}</p>
                <button
                  onClick={() => copyToClipboard(result.hashtags.join(" "))}
                  className="bg-gray-900 text-white px-4 py-2 rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SIDE PANEL */}
      <div className="space-y-6">
        {/* HISTORY (Guest only for now) */}
        {!user && (
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Recent Generations</h3>

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
                  <p className="text-sm font-medium">{item.topic}</p>
                  <p className="text-xs text-gray-500">
                    {item.platform} • {item.tone}
                  </p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAVORITES (Guest only for now) */}
        {!user && (
          <div className="bg-yellow-50 p-4 rounded border">
            <h3 className="text-lg font-semibold mb-3">⭐ Favorite Captions</h3>

            {favorites.length === 0 && (
              <p className="text-sm text-gray-500">No favorites yet</p>
            )}

            <div className="space-y-3">
              {favorites.map((cap, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-3 rounded border"
                >
                  <span className="text-sm">{cap}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(cap)}
                      className="text-xs bg-gray-900 text-white px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => toggleFavoriteLocal(cap)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logged-in message */}
        {user && (
          <div className="bg-green-50 p-4 rounded border">
            <h3 className="text-lg font-semibold">✅ Logged in</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your history will be saved online automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
