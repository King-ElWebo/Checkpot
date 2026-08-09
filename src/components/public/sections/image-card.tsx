import Image from "next/image";

import type { PublicImage } from "@/lib/contracts/public";

type ImageCardProps = {
  image: PublicImage;
  title?: string;
  text?: string;
  ratio?: "portrait" | "landscape" | "square";
  reveal?: boolean;
};

export function ImageCard({ image, title, text, ratio = "portrait", reveal = false }: ImageCardProps) {
  return (
    <figure className={`image-card image-card-${ratio}`} data-reveal={reveal ? "item" : undefined}>
      <span className="image-card-media">
        <Image
          fill
          alt={image.alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={image.src}
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
