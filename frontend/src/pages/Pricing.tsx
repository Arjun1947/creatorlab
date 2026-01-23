import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "10 generations per day",
      "All generator types",
      "English & Hinglish support",
      "Save generation history",
      "Basic support",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious content creators",
    features: [
      "Unlimited generations",
      "All generator types",
      "English & Hinglish support",
      "Save generation history",
      "Priority support",
      "Early access to new features",
      "API access (coming soon)",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
];

export default function Pricing() {
  const { user, profile } = useAuth();

  return user ? (
    <DashboardLayout title="Pricing">
      <PricingContent profile={profile} />
    </DashboardLayout>
  ) : (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <PricingContent profile={null} />
      </div>
    </div>
  );
}

function PricingContent({ profile }: { profile: { is_pro: boolean } | null }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Start free and upgrade when you need more power for your content creation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? "gradient-border border-2" : "border-border/50"}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.highlighted && (
                  <Badge className="gradient-primary text-primary-foreground border-0">
                    Popular
                  </Badge>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground">{plan.period}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.highlighted ? (
                profile?.is_pro ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full gradient-primary text-primary-foreground">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {plan.cta}
                  </Button>
                )
              ) : profile?.is_pro ? (
                <Button variant="outline" disabled className="w-full">
                  Free Tier
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  {plan.cta}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Need more? Contact us at{" "}
          <a href="mailto:hello@creatorlab.app" className="text-primary hover:underline">
            hello@creatorlab.app
          </a>
        </p>
      </div>
    </div>
  );
}
