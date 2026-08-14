import { getDatabase } from "@/db";
import { pageContent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import PageEditClient from "./page-client";

export default async function PageEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const database = getDatabase();
  
  let item: any = null;
  if (!isNew) {
    item = await database.query.pageContent.findFirst({
      where: eq(pageContent.id, id),
    });
    if (!item) redirect("/admin/pages");
  }

  return <PageEditClient isNew={isNew} id={id} initialData={item} />;
}
