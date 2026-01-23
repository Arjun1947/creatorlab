import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface GeneratorFormProps {
  type: "caption" | "hashtag" | "hook";
  onGenerate: (data: GeneratorInput) => Promise<void>;
  isLoading: boolean;
}

export interface GeneratorInput {
  platform: "instagram" | "youtube";
  niche: string;
  language: "english" | "hinglish";
  tone: "funny" | "professional" | "motivational";
  inputText: string;
}

const niches = [
  "Fitness",
  "Travel",
  "Food",
  "Tech",
  "Fashion",
  "Gaming",
  "Education",
  "Comedy",
  "Lifestyle",
  "Business",
  "Beauty",
  "Music",
];

export function GeneratorForm({ type, onGenerate, isLoading }: GeneratorFormProps) {
  const [formData, setFormData] = useState<GeneratorInput>({
    platform: "instagram",
    niche: "",
    language: "english",
    tone: "professional",
    inputText: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.niche && formData.inputText.trim()) {
      onGenerate(formData);
    }
  };

  const typeLabels = {
    caption: { title: "Caption", placeholder: "Describe your content or paste your script..." },
    hashtag: { title: "Hashtag", placeholder: "Describe your content to get relevant hashtags..." },
    hook: { title: "Hook", placeholder: "Describe your video topic or paste your script..." },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Select
            value={formData.platform}
            onValueChange={(value: "instagram" | "youtube") =>
              setFormData({ ...formData, platform: value })
            }
          >
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram Reels</SelectItem>
              <SelectItem value="youtube">YouTube Shorts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Select
            value={formData.niche}
            onValueChange={(value) => setFormData({ ...formData, niche: value })}
          >
            <SelectTrigger id="niche">
              <SelectValue placeholder="Select your niche" />
            </SelectTrigger>
            <SelectContent>
              {niches.map((niche) => (
                <SelectItem key={niche} value={niche.toLowerCase()}>
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={formData.language}
            onValueChange={(value: "english" | "hinglish") =>
              setFormData({ ...formData, language: value })
            }
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hinglish">Hinglish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select
            value={formData.tone}
            onValueChange={(value: "funny" | "professional" | "motivational") =>
              setFormData({ ...formData, tone: value })
            }
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funny">Funny 😂</SelectItem>
              <SelectItem value="professional">Professional 💼</SelectItem>
              <SelectItem value="motivational">Motivational 🔥</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="input">{typeLabels[type].title} Topic / Script</Label>
        <Textarea
          id="input"
          placeholder={typeLabels[type].placeholder}
          value={formData.inputText}
          onChange={(e) => setFormData({ ...formData, inputText: e.target.value })}
          className="min-h-[120px] resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.niche || !formData.inputText.trim()}
        className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate {typeLabels[type].title}s
          </>
        )}
      </Button>
    </form>
  );
}
