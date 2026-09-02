import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { seoRoutes } from "@/content/fixtures/checkpot";
import { listPublishedOutfits } from "@/lib/repositories/outfits";
import { listActiveTaxonomy } from "@/lib/repositories/taxonomy";
import { OutfitsLookbook } from "./lookbook-client";

const seo = seoRoutes.find((r) => r.route === "/outfits")!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: {
    canonical: seo.canonical,
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OutfitsPage() {
  const [outfits, taxonomy] = await Promise.all([
    listPublishedOutfits(),
    listActiveTaxonomy(),
  ]);

  return (
    <div className="flex flex-col bg-white min-h-[80vh]">
      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-6 lg:px-8 2xl:px-12 pt-3 sm:pt-6 pb-1 sm:pb-2">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: "Outfits", href: "/outfits" },
          ]}
        />
      </div>

      <div className="mx-auto w-full max-w-[1400px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12">
        <OutfitsLookbook initialOutfits={outfits} taxonomy={taxonomy} />
      </div>
    </div>
  );
}
