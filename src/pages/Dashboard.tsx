import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LogOut, UtensilsCrossed, Camera, TrendingDown, BarChart3, Sparkles } from "lucide-react";

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const isCafeteria = profile?.role === "cafeteria";

  return (
    <div className="min-h-screen relative">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50">
        <div className="glass-strong">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">EcoTaste Buds</h1>
                <p className="text-xs text-muted-foreground capitalize flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {profile?.role} Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, <span className="text-foreground font-medium">{profile?.full_name}</span>
              </span>
              <Button variant="glass" size="icon" onClick={handleSignOut} className="rounded-xl">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative">
        <div className="mb-12 space-y-3">
          <h2 className="text-4xl font-display font-bold text-foreground flex items-center gap-3">
            {isCafeteria ? "Manage Your Cafeteria" : "Your Eco Journey"}
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </h2>
          <p className="text-muted-foreground text-lg">
            {isCafeteria
              ? "Upload menus, track waste, and reduce carbon footprint"
              : "Choose sustainable meals and track your impact"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isCafeteria ? (
            <>
              <Card variant="eco" className="group animate-fade-in">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/40 group-hover:shadow-glow transition-all">
                    <UtensilsCrossed className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle>Today's Menu</CardTitle>
                  <CardDescription>Add and manage today's food offerings with carbon data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">Manage Menu</Button>
                </CardContent>
              </Card>

              <Card variant="eco" className="group animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/40 group-hover:shadow-glow transition-all">
                    <Camera className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle>Food Photos</CardTitle>
                  <CardDescription>Capture food served and waste at end of day</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">Upload Photos</Button>
                </CardContent>
              </Card>

              <Card variant="carbon" className="group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive/20 to-eco-earth/20 border border-destructive/20 flex items-center justify-center mb-3 group-hover:border-destructive/40 transition-all">
                    <BarChart3 className="w-7 h-7 text-destructive group-hover:scale-110 transition-transform" />
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
              <Card variant="eco" className="group animate-fade-in">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/40 group-hover:shadow-glow transition-all">
                    <UtensilsCrossed className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle>Today's Menu</CardTitle>
                  <CardDescription>Browse eco-friendly meal options for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">View Menu</Button>
                </CardContent>
              </Card>

              <Card variant="eco" className="group animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-3 group-hover:border-primary/40 group-hover:shadow-glow transition-all">
                    <TrendingDown className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle>My Carbon Tracker</CardTitle>
                  <CardDescription>Track your personal carbon savings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="eco" className="w-full">View Progress</Button>
                </CardContent>
              </Card>

              <Card variant="carbon" className="group animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive/20 to-eco-earth/20 border border-destructive/20 flex items-center justify-center mb-3 group-hover:border-destructive/40 transition-all">
                    <Camera className="w-7 h-7 text-destructive group-hover:scale-110 transition-transform" />
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
