import Sidebar from "../components/Sidebar";
import ToolCard from "../components/ToolCard";

export default function Dashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ToolCard
            title="Caption & Hashtag Generator"
            description="Generate viral captions and hashtags for Reels and Shorts."
          />
          <ToolCard
            title="Reel / Shorts Analyzer"
            description="Analyze performance and get improvement tips."
          />
          <ToolCard
            title="Best Time to Post"
            description="Find the best posting time for maximum reach."
          />
          <ToolCard
            title="Content Idea Generator"
            description="Get daily content ideas tailored to your niche."
          />
          <ToolCard
            title="Bio & Profile Optimizer"
            description="Optimize your bio for better conversions."
          />
        </div>
      </main>
    </div>
  );
}
