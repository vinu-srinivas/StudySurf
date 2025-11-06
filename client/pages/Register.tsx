import apiClient from "@/apiClient";
import { Button } from "@/components/ui/button";
import GlassSurface from "@/components/ui/GlassSurface";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password != confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post("/register/", { username, password })
      toast.success("Registration successful! Please Login")
      navigate("/login");
    }
    catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        const firstErrorKey = Object.keys(errorData)[0];
        const firstErrorMsg = errorData[firstErrorKey][0];
        setError(firstErrorMsg);
      }
      else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration failed:", err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh flex items-center justify-center py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Sign up to start your StudySurf journey
            </p>
          </div>

          <GlassSurface
            height="auto"
            borderRadius={20}
            backgroundOpacity={0.06}
            saturation={1.4}
            className="w-full lg:w-3/4 p-10 lg:p-12 mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
            <div className="text-red-500 text-center p-3 bg-red-900/20 rounded-lg">
              <b>{error}</b>
            </div>
          )}
              <div className="space-y-3 lg:w-[500px] md:w-[400px] sm:w-[300px]">
                <label htmlFor="username" className="text-base font-semibold text-white block">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="text-base font-semibold text-white block">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="password" className="text-base font-semibold text-white block">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-center text-base text-white/80">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </GlassSurface>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <span>←</span>
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
