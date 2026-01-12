import { useEffect, useState } from "react";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("creatorlab-history")) || [];
    setHistory(saved.reverse()); // latest first
  }, []);

  if (history.length === 0) {
    return <p className="text-gray-500">No history yet.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📜 Generation History</h2>

      <div className="space-y-6">
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded p-4 shadow-sm"
          >
            <div className="text-sm text-gray-500 mb-2">
              Topic: <b>{item.topic}</b> | Tone: <b>{item.tone}</b>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold">Captions</h4>
              <ul className="list-disc ml-5">
                {item.captions.map((cap, i) => (
                  <li key={i}>{cap}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Hashtags</h4>
              <p>{item.hashtags.join(" ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
