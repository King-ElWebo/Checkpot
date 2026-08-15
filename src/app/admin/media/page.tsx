import { listAllMediaForAdmin } from "@/lib/repositories/media";
import { MediaGallery } from "./media-gallery";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const mediaItems = await listAllMediaForAdmin();

  return (
    <div className="dashboard-stack">
      <section className="page-intro">
        <div className="eyebrow">Mediathek</div>
        <h1>Bilder & Uploads</h1>
        <p className="text-sm text-[#78716c] mt-1">
          Verwalten Sie Fotografien, Markenlogos und Kampagnenbilder für die gesamte Website.
        </p>
      </section>

      <MediaGallery initialMedia={mediaItems} />
    </div>
  );
}
