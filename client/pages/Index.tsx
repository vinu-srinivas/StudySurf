import { Button } from "@/components/ui/button";
import MagicBento, { type BentoCard } from "@/components/visuals/MagicBento";
import { PlayCircle, FileText, Compass, MessageSquare } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";
import CircularText from "@/components/visuals/CircularText";

export default function Index() {
  return (
    <div className="relative">
      <section className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mt-6 -mr-1">
            Extract knowledge from any and every academic site in seconds
          </h1>
          <p className="max-w-xl text-muted-foreground mt-6">
            <span className="text-white">StudySurf explores the web for relevant videos, papers, and documents. Built to fetch perfect and relevant resources within seconds.</span>
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row mt-6">
            <Button size="lg" asChild>
              <a href="#cta">Start Surfing</a>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="pointer-events-auto">
            <CircularText
              text="• StudySurf • Extract • Explore • Learn "
              spinDuration={18}
              className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] text-white/90"
            />
          </div>
        </div>
      </section>

      <span id="features" className="block h-0 w-0 overflow-hidden" aria-hidden="true" />
      <section id="showcase" className="container space-y-10 py-16 md:py-24">
        <h2 className="text-center text-2xl font-semibold tracking-tight">StudySurf can</h2>
        <div className="flex justify-center">
          <MagicBento
            glowColor="43, 0, 255"
            spotlightRadius={320}
            cards={featureCards}
            enableTilt={false}
            enableMagnetism={true}
          />
        </div>
      </section>

      {/* Join / CTA bar */}
      <section id="cta" className="container py-10">
        <GlassSurface width="100%" height={112} borderRadius={20} backgroundOpacity={0.06} saturation={1.4} className="w-full">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row w-full px-4">
            <div>
              <h3 className="text-lg font-semibold">Join StudySurf</h3>
              <p className="text-sm text-muted-foreground">Create your account or log in to sync bookmarks and identity.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="lg" >
                <a href="register">
                  Create Account
                </a>
              </Button>
              <Button size="lg" variant="outline">
                <a href="login">
                  Login
                </a>
              </Button>
            </div>
          </div>
        </GlassSurface>
      </section>
    </div>
  );
}

const featureCards: BentoCard[] = [
  {
    label: "YouTube",
    title: "Fetch YouTube Videos",
    description: "Pick the right video to learn, instead of spending time to find the right one.",
    icon: <PlayCircle className="h-5 w-5" />,
  },
  {
    label: "Papers",
    title: "Find Research Papers",
    description: "Get the most relevant and accurate papers and citations.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Resources",
    title: "Locate Better Resources",
    description: "Articles, blogs, websites or documents — StudySurf gets it all.",
    icon: <Compass className="h-5 w-5" />,
  },
  {
    label: "SurfChat",
    title: "SurfChat",
    description: "A public chat where students suggest and recommend resources.",
    icon: <MessageSquare className="h-5 w-5" />,
  },
];
