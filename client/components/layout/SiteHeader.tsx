import { Link } from "react-router-dom";
import GlassSurface from "@/components/ui/GlassSurface";
import { Button } from "../ui/button";
import { useState,useEffect } from "react";

export default function SiteHeader() {
  const accessToken = localStorage.getItem("accessToken");
  const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
  
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.dispatchEvent(new Event('authChange'));
  }
  return (
    <header className="relative z-40 pt-4">
      <div className="container flex items-center justify-between gap-4 pt-2">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="tracking-tight">StudySurf</span>
        </Link>
        <div className="hidden md:block fixed top-6 right-6 z-50"><GlassSurface className="max-w-max" height={48} borderRadius={18} backgroundOpacity={0.06} saturation={1.4}>
          <nav className="flex items-center gap-6 px-4">
            <Link to="/learn" className="text-base font-medium text-white/90 hover:text-white transition-colors">Learn</Link>
            <Link to="/bookmarks" className="text-base font-medium text-white/90 hover:text-white transition-colors">BookMark</Link>
            <Link to="/surfchat" className="text-base font-medium text-white/90 hover:text-white transition-colors">SurfChat</Link>
            {isLoggedIn ? (
              <>
                <Link onClick={handleLogout} to="/" className="text-base font-medium text-white/90 hover:text-white transition-colors">Logout</Link>
              </>
            ): (
                <>
                  <Link to="/login" className="text-base font-medium text-white/90 hover:text-white transition-colors">Login</Link>
                </>
            )}
          </nav>
        </GlassSurface></div>
      </div>
    </header>
  );
}
