import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Crown, Trash2 } from "lucide-react";

export default function Settings() {
  const { user, profile, signOut } = useAuth();

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {profile?.is_pro ? "Pro Plan" : "Free Plan"}
                  </span>
                  {profile?.is_pro ? (
                    <Badge className="gradient-primary text-primary-foreground border-0">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile?.is_pro
                    ? "Unlimited generations per day"
                    : `${Math.max(0, 10 - (profile?.daily_generations_count || 0))} generations remaining today`}
                </p>
              </div>
              {!profile?.is_pro && (
                <Button className="gradient-primary text-primary-foreground">
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
