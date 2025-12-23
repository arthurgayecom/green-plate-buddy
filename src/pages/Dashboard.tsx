import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LogOut, UtensilsCrossed, Camera, TrendingDown, BarChart3 } from "lucide-react";

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const isCafeteria = profile?.role === "cafeteria";

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">EcoTaste Buds</h1>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role} Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {profile?.full_name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">
            {isCafeteria ? "Manage Your Cafeteria" : "Your Eco Journey"}
          </h2>
          <p className="text-muted-foreground">
            {isCafeteria
              ? "Upload menus, track waste, and reduce carbon footprint"
              : "Choose sustainable meals and track your impact"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isCafeteria ? (
            <>
              <Card variant="eco" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Today's Menu</CardTitle>
                  <CardDescription>Add and manage today's food offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">Manage Menu</Button>
                </CardContent>
              </Card>

              <Card variant="eco" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Food Photos</CardTitle>
                  <CardDescription>Capture food served and waste at end of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">Upload Photos</Button>
                </CardContent>
              </Card>

              <Card variant="carbon" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-eco-carbon/10 flex items-center justify-center mb-2">
                    <BarChart3 className="w-6 h-6 text-eco-carbon" />
                  </div>
                  <CardTitle>Carbon Analytics</CardTitle>
                  <CardDescription>View your carbon emissions and improvement tips</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="carbon" className="w-full">View Analytics</Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card variant="eco" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <UtensilsCrossed className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Today's Menu</CardTitle>
                  <CardDescription>Browse eco-friendly meal options</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">View Menu</Button>
                </CardContent>
              </Card>

              <Card variant="eco" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <TrendingDown className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>My Carbon Tracker</CardTitle>
                  <CardDescription>Track your personal carbon savings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">View Progress</Button>
                </CardContent>
              </Card>

              <Card variant="carbon" className="cursor-pointer hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-eco-carbon/10 flex items-center justify-center mb-2">
                    <Camera className="w-6 h-6 text-eco-carbon" />
                  </div>
                  <CardTitle>Waste Gallery</CardTitle>
                  <CardDescription>See cafeteria waste and carbon impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="carbon" className="w-full">View Gallery</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
