import { Button } from "@/components/ui/button";
import GlassSurface from "@/components/ui/GlassSurface";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/",
        {
          "username": username,
          "password": password
        }
      )
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      window.dispatchEvent(new Event('authChange'));
      toast.success("Login successful")
      navigate("/");
    }
    catch (err) {
      console.log("Login failed: ", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
      console.log(error);
      
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
            <h1 className="text-5xl font-extrabold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Sign in to your StudySurf account to continue exploring
            </p>
          </div>

          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={20}
            backgroundOpacity={0.06}
            saturation={1.4}
            className="w-full p-10 lg:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center">
                {error && <b style={{ color: "red" }}>{error}</b>}
              </div>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className="w-full px-5 py-3.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 bg-white/10 border border-white/20 rounded cursor-pointer"
                  />
                  <span className="text-white/80 text-base">Remember me</span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors text-base">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-center text-base text-white/80">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Create one
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
