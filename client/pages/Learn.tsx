import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, BookmarkPlus } from "lucide-react";
import apiClient from "@/apiClient";
import { toast } from "sonner";

// --- TYPES ---

// Define types for the different search results
type SearchResult = {
  title: string;
  url: string;
  snippet?: string; // For web/papers
  thumbnail?: string;
  channel?: string;
  authors?: string[];// For YouTube
};

// Define the search types
type SearchType = "web" | "youtube" | "papers";

// Define the cache type
type Cache = Record<string, SearchResult[]>;

// --- COMPONENT ---

export default function Learn() {
  // --- STATE ---
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("web");
  const [department, setDepartment] = useState("cs");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State to cache results you've already fetched
  const [cache, setCache] = useState<Cache>({});

  // --- LOGIC ---

  /**
   * Main function to run the API search.
   * Checks the cache first before fetching.
   */
  const runSearch = async () => {
    // Don't run if the query is empty
    if (!query.trim()) {
      return;
    }

    // 1. Create a unique key for this search
    const cacheKey = `${searchType}-${searchType === 'web' ? department : ''}-${query}`;

    // 2. Check if the result is already in the cache
    if (cache[cacheKey]) {
      setResults(cache[cacheKey]); // Load from cache instantly
      return; // Stop here, don't re-fetch
    }

    // 3. If not in cache, continue to fetch...
    setIsLoading(true);
    setError("");
    setResults([]); 

    let endpoint = "";
    let params: any = { q: query };

    // Set the correct endpoint and params based on the selected tab
    switch (searchType) {
      case "web":
        endpoint = "/search/web/";
        params.dept = department; // Add the department for web search
        break;
      case "youtube":
        endpoint = "/search/youtube/";
        break;
      case "papers":
        endpoint = "/search/papers/";
        break;
    }

    try {
      // 4. Call the API
      const response = await apiClient.get(endpoint, { params });
      
      let newResults: SearchResult[] = [];
      if (response.data.message) {
        toast.info("No results found from the specified websites.");
      } else {
        newResults = response.data;
      }

      // 5. Update both the results AND the cache
      setResults(newResults);
      setCache(prevCache => ({
        ...prevCache,
        [cacheKey]: newResults // Save to cache
      }));

    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the form submission (clicking the search button or pressing Enter).
   * This clears the cache for the query to force a fresh search.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Invalidate the cache for this one search to force a refetch
    const cacheKey = `${searchType}-${searchType === 'web' ? department : ''}-${query}`;
    setCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[cacheKey];
      return newCache;
    });

    runSearch();
  };

  /**
   * This useEffect automatically re-runs the search when the
   * searchType (tabs) or department (dropdown) changes.
   */
  useEffect(() => {
    // We only run this if there is already a query in the search bar.
    if (query.trim() !== "") {
      runSearch(); // This will now hit the cache
    }
  }, [searchType, department]); // Dependency array: watches these states

  /**
   * Handles clicking the bookmark button on a search result.
   */
  const handleBookmark = async (result: SearchResult) => {
    try {
      await apiClient.post("/bookmarks/", {
        title: result.title,
        url: result.url,
        resource_type: searchType,
        snippet: result.snippet,
        thumbnail: result.thumbnail,
        channel_or_authors:result.channel||result.authors?.join(', '),
      });
      toast.success("Bookmarked!");
    } catch (err) {
      console.error("Failed to bookmark:", err);
      toast.error("Failed to add bookmark.");
    }
  };

  // --- JSX ---

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Learn & Discover</h1>
        <p className="text-muted-foreground text-lg">
          Find the best articles, videos, and papers for your studies.
        </p>
      </div>

      {/* --- SEARCH FORM --- */}
      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Search for 'Python loops' or 'Ohm's Law'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 text-base"
          />
          <Button type="submit" size="icon" className="h-11 w-11 flex-shrink-0" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>

        {/* --- TABS FOR SEARCH TYPE --- */}
        <Tabs value={searchType} onValueChange={(value) => setSearchType(value as SearchType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="web">Web Articles</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="papers">Research Papers</TabsTrigger>
          </TabsList>

          {/* --- DEPARTMENT SELECTOR (Only shows for Web) --- */}
          {searchType === "web" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Select Department:
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option className="text-white bg-gray-800" value="cs">Computer Science (CS)</option>
                <option className="text-white bg-gray-800" value="electrical">Electrical (EE)</option>
                <option className="text-white bg-gray-800" value="mech">Mechanical (Mech)</option>
              </select>
            </div>
          )}
        </Tabs>
      </form>

      {/* --- RESULTS AREA --- */}
      <div className="space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 bg-white/5 border border-white/10 rounded-lg flex gap-4 items-start"
          >
            {/* Optional: Show thumbnail for YouTube */}
            {result.thumbnail && (
              <img 
                src={result.thumbnail} 
                alt={result.title} 
                className="w-24 h-24 object-cover rounded-md" 
              />
            )}
            
            <div className="flex-1">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-400 hover:underline"
              >
                {result.title}
              </a>
              {result.channel && (
                <p className="text-white/90 text-sm font-medium mt-1">
                  {result.channel}
                </p>
              )}
              {result.authors && (
                <p className="text-white/70 text-sm italic mt-1 truncate">
                  {result.authors.join(', ')}
                </p>
              )}
              <p className="text-white/70 mt-1 text-sm line-clamp-2">
                {result.snippet}
              </p>
            </div>
            
            {/* --- BOOKMARK BUTTON --- */}
            <Button
              variant="outline"
              size="icon"
              className="bg-transparent border-white/20 hover:bg-white/10"
              onClick={() => handleBookmark(result)}
              aria-label="Bookmark this result"
            >
              <BookmarkPlus className="h-5 w-5" />
            </Button>
          </div>
        ))}
        
        {/* Show a message if loading and no results yet */}
        {isLoading && results.length === 0 && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-white/70" />
          </div>
        )}
      </div>
    </div>
  );
}