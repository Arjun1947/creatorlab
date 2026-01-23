import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneratorForm, GeneratorInput } from "@/components/generators/GeneratorForm";
import { OutputCard } from "@/components/generators/OutputCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Hash, Zap, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type GenerationType = "caption" | "hashtag" | "hook";

interface GenerationResult {
  type: GenerationType;
  outputs: string[];
  input: GeneratorInput;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<GenerationType>("caption");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const { profile, refreshProfile, user } = useAuth();
  const { toast } = useToast();

  const canGenerate = profile?.is_pro || (profile?.daily_generations_count || 0) < 10;

  const handleGenerate = async (type: GenerationType, input: GeneratorInput) => {
    if (!canGenerate) {
      toast({
        title: "Daily limit reached",
        description: "Upgrade to Pro for unlimited generations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate", {
        body: {
          type,
          platform: input.platform,
          niche: input.niche,
          language: input.language,
          tone: input.tone,
          inputText: input.inputText,
        },
      });

      if (error) throw error;

      const outputs = data.outputs || [];
      setResult({ type, outputs, input });

      // Save to history
      if (user) {
        await supabase.from("generations").insert({
          user_id: user.id,
          platform: input.platform,
          niche: input.niche,
          language: input.language,
          tone: input.tone,
          input_text: input.inputText,
          generation_type: type,
          output: outputs,
        });

        // Update daily count
        const today = new Date().toISOString().split("T")[0];
        if (profile?.last_generation_date !== today) {
          await supabase
            .from("profiles")
            .update({ daily_generations_count: 1, last_generation_date: today })
            .eq("user_id", user.id);
        } else {
          await supabase
            .from("profiles")
            .update({ daily_generations_count: (profile?.daily_generations_count || 0) + 1 })
            .eq("user_id", user.id);
        }
        await refreshProfile();
      }

      toast({
        title: "Generated!",
        description: `Your ${type}s are ready.`,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to generate. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "caption" as const, label: "Captions", icon: MessageSquare },
    { id: "hashtag" as const, label: "Hashtags", icon: Hash },
    { id: "hook" as const, label: "Hooks", icon: Zap },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-4xl mx-auto space-y-6">
        {!canGenerate && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You've reached your daily limit. Upgrade to Pro for unlimited generations.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GenerationType)}>
          <TabsList className="grid w-full grid-cols-3">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5 text-primary" />
                    {tab.label} Generator
                  </CardTitle>
                  <CardDescription>
                    {tab.id === "caption" && "Generate engaging captions for your Reels and Shorts"}
                    {tab.id === "hashtag" && "Get trending hashtags to maximize your reach"}
                    {tab.id === "hook" && "Create scroll-stopping hooks for your videos"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GeneratorForm
                    type={tab.id}
                    onGenerate={(input) => handleGenerate(tab.id, input)}
                    isLoading={isLoading && activeTab === tab.id}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {result && result.type === activeTab && result.outputs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generated {result.type}s</h3>
            <div className="grid gap-4">
              {result.outputs.map((output, index) => (
                <OutputCard
                  key={index}
                  content={output}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
