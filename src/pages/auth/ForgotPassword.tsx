
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthLayout } from "@/components/layout/AuthLayout";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call for password reset
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
      });
    }, 1500);
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md overflow-hidden border-none shadow-lg animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 z-0"></div>
        
        <CardHeader className="relative z-10 space-y-1 text-center">
          <div className="mx-auto mb-4 bg-blue-500/10 p-2 rounded-full w-16 h-16 flex items-center justify-center">
            {isSubmitted ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <Mail className="h-8 w-8 text-blue-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isSubmitted ? "Check Your Email" : "Forgot Password?"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSubmitted 
              ? `We've sent a password reset link to ${email}` 
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4 pt-4">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full transition-all bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button 
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="transition-all"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="relative z-10 flex justify-center pb-6">
          <Link 
            to="/login" 
            className="text-sm font-medium text-primary flex items-center hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;
