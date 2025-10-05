import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/integrations/supabase/SupabaseProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  EyeOff, 
  Shield, 
  User, 
  Mail, 
  Lock, 
  AlertCircle,
  CheckCircle,
  Info
} from "lucide-react";

// Demo credentials
const DEMO_CREDENTIALS = {
  admin: {
    email: "admin@campus-security.com",
    password: "admin123",
    role: "Administrator"
  },
  security: {
    email: "security@campus-security.com", 
    password: "security123",
    role: "Security Officer"
  },
  analyst: {
    email: "analyst@campus-security.com",
    password: "analyst123", 
    role: "Data Analyst"
  }
};

interface AuthState {
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  error: string;
  success: string;
  isLoading: boolean;
}

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [authState, setAuthState] = useState<AuthState>({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    error: "",
    success: "",
    isLoading: false
  });

  const handleInputChange = (field: keyof AuthState, value: string) => {
    setAuthState(prev => ({
      ...prev,
      [field]: value,
      error: "",
      success: ""
    }));
  };

  const handleDemoLogin = async (credentials: typeof DEMO_CREDENTIALS.admin) => {
    setAuthState(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password,
      isLoading: true,
      error: "",
      success: ""
    }));

    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: false, success: `Successfully logged in as ${credentials.role}!` }));
    navigate('/');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState(prev => ({ ...prev, isLoading: true, error: "", success: "" }));

    const { error } = await supabase.auth.signInWithPassword({
      email: authState.email,
      password: authState.password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: false, success: "Welcome back!" }));
    navigate('/');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authState.password !== authState.confirmPassword) {
      setAuthState(prev => ({
        ...prev,
        error: "Passwords do not match"
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: "", success: "" }));

    const { error } = await supabase.auth.signUp({
      email: authState.email,
      password: authState.password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: error.message }));
      return;
    }

    setAuthState(prev => ({
      ...prev,
      isLoading: false,
      success: "Account created! Check your email to confirm."
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Security</h1>
          <p className="text-muted-foreground">
            Entity Resolution System
          </p>
        </div>


        {/* Auth Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Use demo credentials: admin@campus-security.com / admin123
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={authState.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type={authState.showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={authState.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setAuthState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      >
                        {authState.showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={authState.isLoading}>
                    {authState.isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={authState.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={authState.showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={authState.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setAuthState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      >
                        {authState.showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type={authState.showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={authState.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setAuthState(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                      >
                        {authState.showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={authState.isLoading}>
                    {authState.isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Error/Success Messages */}
            {authState.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authState.error}</AlertDescription>
              </Alert>
            )}

            {authState.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{authState.success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Campus Security Entity Resolution System</p>
          <p className="mt-1">Demo Environment - Not for Production Use</p>
        </div>
      </div>
    </div>
  );
}
