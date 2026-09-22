declare module "cloudflare:workers" {
  export const env: {
    MEDIA_BUCKET?: import("@cloudflare/workers-types").R2Bucket;
    [key: string]: unknown;
  };
}
