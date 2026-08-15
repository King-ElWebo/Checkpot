import { listPublishedOutfits } from "@/lib/repositories/outfits";
import { listActiveTaxonomy } from "@/lib/repositories/taxonomy";
import { OutfitsLookbook } from "./lookbook-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outfits | Checkpot",
  description: "Entdecke aktuelle Looks und Styling-Ideen von Checkpot.",
};

export default async function OutfitsPage() {
  const outfits = await listPublishedOutfits();
  const taxonomy = await listActiveTaxonomy();

  return (
    <div style={{ maxWidth: "1920px", margin: "0 auto" }}>
      <OutfitsLookbook initialOutfits={outfits} taxonomy={taxonomy} />
    </div>
  );
}
