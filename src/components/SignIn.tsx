import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Sparkles, Briefcase, Users } from "lucide-react";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  const [role, setRole] = useState<"company" | "creator">("creator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">
            {step === "signIn" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {step === "signIn" 
              ? "Sign in to your account to continue" 
              : "Join Connect to start collaborating"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setLoading(true);
              
              try {
                const formData = new FormData(event.currentTarget);
                await signIn("password", formData);
                // On successful sign in, redirect to dashboard
                window.location.href = '/dashboard';
              } catch (err) {
                console.error("Sign in error:", err);
                setError(err instanceof Error ? err.message : "An error occurred during sign in");
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                required
              />
            </div>
            
            {step === "signUp" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  type="text"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                required
              />
            </div>
            
            {step === "signUp" && (
              <div className="space-y-3">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="company"
                      checked={role === "company"}
                      onChange={(e) => setRole(e.target.value as "company" | "creator")}
                      className="sr-only"
                    />
                    <div
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        role === "company"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Briefcase className="h-6 w-6" />
                      <span className="font-medium">Company</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="creator"
                      checked={role === "creator"}
                      onChange={(e) => setRole(e.target.value as "company" | "creator")}
                      className="sr-only"
                    />
                    <div
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        role === "creator"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Users className="h-6 w-6" />
                      <span className="font-medium">Creator</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
            
            <input name="flow" type="hidden" value={step} />
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Loading..." : step === "signIn" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button
            type="button"
            variant="ghost"
            disabled={loading}
            onClick={() => {
              setStep(step === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
            className="w-full"
          >
            {step === "signIn" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

