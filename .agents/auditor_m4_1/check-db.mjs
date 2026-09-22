import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function check() {
  const res = await sql`
    SELECT 
      COUNT(*) FILTER (WHERE url LIKE '%blob.vercel-storage.com%') AS blob_count,
      COUNT(*) FILTER (WHERE url LIKE '%media.checkpot.at%') AS r2_count,
      COUNT(*) FILTER (WHERE url NOT LIKE '%http%') AS local_count,
      COUNT(*) AS total_count
    FROM media
  `;
  console.log("Database state:", res);
}

check().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
