import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface OutputCardProps {
  content: string;
  index: number;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function OutputCard({ content, index, onRegenerate, isRegenerating }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      "animate-fade-in",
      { "animation-delay-100": index === 1, "animation-delay-200": index === 2 }
    )} style={{ animationDelay: `${index * 100}ms` }}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              {copied ? (
                <Check className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {onRegenerate && (
              <Button
                variant="outline"
                size="icon"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="h-8 w-8"
              >
                <RefreshCw className={cn("h-4 w-4", isRegenerating && "animate-spin")} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
