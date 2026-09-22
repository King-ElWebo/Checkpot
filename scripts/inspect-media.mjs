import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const rows = await sql`SELECT id, url, title, alt, created_at FROM media ORDER BY created_at ASC`;
  console.log(`Found ${rows.length} media records in Neon:`);
  let vercelBlobCount = 0;
  let localCount = 0;
  let otherCount = 0;

  for (const r of rows) {
    if (r.url.includes("blob.vercel-storage.com")) {
      vercelBlobCount++;
      console.log(`[VERCEL_BLOB] ${r.id}: ${r.url}`);
    } else if (r.url.startsWith("/")) {
      localCount++;
      console.log(`[LOCAL] ${r.id}: ${r.url}`);
    } else {
      otherCount++;
      console.log(`[OTHER] ${r.id}: ${r.url}`);
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Total: ${rows.length}`);
  console.log(`  Vercel Blob: ${vercelBlobCount}`);
  console.log(`  Local: ${localCount}`);
  console.log(`  Other: ${otherCount}`);
}

main().catch(console.error);
