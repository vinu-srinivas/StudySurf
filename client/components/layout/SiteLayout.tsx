import { PropsWithChildren } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import Aurora from "@/components/visuals/Aurora";

export default function SiteLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-dvh flex flex-col relative">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Aurora colorStops={["#2B00FF", "#10d7e5", "#2B00FF"]} amplitude={1.2} blend={0.5} />
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
