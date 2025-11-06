import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Bookmark } from "lucide-react";
import apiClient from "@/apiClient";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// 1. Update the interface to include the new fields
interface Bookmark {
  id: number;
  user: string;
  title: string;
  url: string;
  resource_type: string;
  created_at: string;
  snippet?: string;
  thumbnail?: string;
  channel_or_authors?: string;
}

export default function BookMark() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // ... (fetchBookmarks and useEffect are perfect, no change needed) ...
  const fetchBookmarks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.get<Bookmark[]>("/bookmarks/");
      setBookmarks(response.data);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
      setError("Failed to load your bookmarks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  // ... (handleDelete is perfect, no change needed) ...
  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/bookmarks/${id}/`);
      setBookmarks(currentBookmarks => 
        currentBookmarks.filter(bookmark => bookmark.id !== id)
      );
      toast.success("Bookmark deleted!");
    } catch (err) {
      console.error("Failed to delete bookmark:", err);
      toast.error("Failed to delete bookmark.");
    }
  };

  /**
   * Renders the main content (loader, error, empty state, or list).
   */
  const renderContent = () => {
    if (isLoading) {
      // ... (loader JSX is fine)
    }

    if (error) {
      // ... (error JSX is fine)
    }

    if (bookmarks.length === 0) {
      // ... (empty state JSX is fine)
    }

    // 2. UPDATE THE RENDERED LIST to match the search page
    return (
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="p-4 bg-white/5 border border-white/10 rounded-lg flex gap-4 items-start"
          >
            {/* Show thumbnail if it exists */}
            {bookmark.thumbnail && (
              <img 
                src={bookmark.thumbnail} 
                alt={bookmark.title} 
                className="w-24 h-24 object-cover rounded-md" 
              />
            )}
            
            <div className="flex-1">
              {/* Badge for resource type */}
              <span className="text-xs font-medium bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full capitalize">
                {bookmark.resource_type}
              </span>
              
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg font-semibold text-blue-400 hover:underline mt-2"
              >
                {bookmark.title}
              </a>
              
              {/* Show Channel or Authors if it exists */}
              {bookmark.channel_or_authors && (
                <p className="text-white/90 text-sm font-medium mt-1">
                  {bookmark.channel_or_authors}
                </p>
              )}

              {/* Show Snippet if it exists */}
              <p className="text-white/70 mt-1 text-sm line-clamp-2">
                {bookmark.snippet}
              </p>
            </div>
            
            {/* --- DELETE BUTTON --- */}
            <Button
              variant="destructive"
              size="icon"
              className="bg-red-800/50 hover:bg-red-800/80"
              onClick={() => handleDelete(bookmark.id)}
              aria-label="Delete bookmark"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      {/* ... (Header and Footer JSX are fine) ... */}
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Your Bookmarks</h1>
        <p className="text-muted-foreground text-lg">
          All your saved resources in one place.
        </p>
      </div>

      {renderContent()}

      <div className="text-center mt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <span>←</span>
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}