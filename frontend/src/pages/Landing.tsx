import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Hash, MessageSquare, ArrowRight, Check, Instagram, Youtube } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Caption Generator",
    description: "Create engaging captions that boost engagement and followers.",
  },
  {
    icon: Hash,
    title: "Hashtag Generator",
    description: "Get trending, niche-specific hashtags for maximum reach.",
  },
  {
    icon: Zap,
    title: "Hook Generator",
    description: "Generate scroll-stopping hooks that keep viewers watching.",
  },
];

const pricingFeatures = {
  free: ["10 generations/day", "All generator types", "English & Hinglish", "Save history"],
  pro: ["Unlimited generations", "Priority support", "Early access to new features", "API access coming soon"],
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CreatorLab</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing">
              <Button variant="ghost">Pricing</Button>
            </Link>
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="gradient-primary text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-3 w-3" />
              AI-Powered Content Creation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Create Viral Content{" "}
              <span className="gradient-text">in Seconds</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate trend-based captions, hashtags, and hooks for Instagram Reels and YouTube Shorts. 
              Powered by AI, made for creators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-lg">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  <Instagram className="h-5 w-5" />
                  <Youtube className="h-5 w-5" />
                </div>
                <span>Reels & Shorts ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Go Viral
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three powerful generators designed to maximize your content's reach and engagement.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Tier */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Free</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pricingFeatures.free.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="gradient-border border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Pro</h3>
                  <Badge className="gradient-primary text-primary-foreground border-0">Popular</Badge>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pricingFeatures.pro.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup">
                  <Button className="w-full gradient-primary text-primary-foreground">Upgrade to Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Better Content?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of creators using CreatorLab to grow their audience.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="gradient-primary text-primary-foreground px-8 h-12 text-lg">
              Get Started — It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">CreatorLab</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CreatorLab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
