import Image from "next/image";

import type { PublicImage } from "@/lib/contracts/public";

type ImageCardProps = {
  image: PublicImage;
  title?: string;
  text?: string;
  ratio?: "portrait" | "landscape" | "square";
  reveal?: boolean;
  sizes?: string;
  preload?: boolean;
};

export function ImageCard({
  image,
  title,
  text,
  ratio = "portrait",
  reveal = false,
  sizes = "(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw",
  preload = false,
}: ImageCardProps) {
  return (
    <figure className={`image-card image-card-${ratio}`} data-reveal={reveal ? "item" : undefined}>
      <span className="image-card-media">
        <span aria-hidden="true" className="image-card-fallback">
          Bild folgt
        </span>
        <Image
          fill
          alt={image.alt}
          loading={preload ? undefined : "lazy"}
          preload={preload}
          sizes={sizes}
          src={image.src}
          style={{ objectPosition: image.objectPosition ?? "50% 50%" }}
        />
      </span>
      {title || text || image.caption ? (
        <figcaption>
          {title ? <strong>{title}</strong> : null}
          {text ? <span>{text}</span> : null}
          {!text && image.caption ? <span>{image.caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
