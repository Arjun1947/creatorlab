import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Copy, Check, Trash2, MessageSquare, Hash, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface Generation {
  id: string;
  platform: string;
  niche: string;
  language: string;
  tone: string;
  input_text: string;
  generation_type: string;
  output: Json;
  created_at: string;
}

const typeIcons = {
  caption: MessageSquare,
  hashtag: Hash,
  hook: Zap,
};

export default function History() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchGenerations();
    }
  }, [user]);

  const fetchGenerations = async () => {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setGenerations(data as Generation[]);
    }
    setLoading(false);
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("generations").delete().eq("id", id);
    if (!error) {
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      toast({ title: "Deleted", description: "Generation removed from history." });
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="History">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="History">
      <div className="max-w-4xl mx-auto">
        {generations.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No generations yet. Start creating!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {generations.map((gen) => {
              const Icon = typeIcons[gen.generation_type as keyof typeof typeIcons] || MessageSquare;
              const outputs = Array.isArray(gen.output) ? gen.output as string[] : [];

              return (
                <Card key={gen.id} className="group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base capitalize">
                          {gen.generation_type}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs capitalize">
                          {gen.platform}
                        </Badge>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {gen.niche}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(gen.created_at), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      Input: {gen.input_text}
                    </p>
                    <div className="space-y-2">
                      {outputs.map((output, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-4 p-3 bg-muted/50 rounded-lg"
                        >
                          <p className="text-sm flex-1">{output}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => handleCopy(output, `${gen.id}-${idx}`)}
                          >
                            {copiedId === `${gen.id}-${idx}` ? (
                              <Check className="h-4 w-4 text-success" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(gen.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
