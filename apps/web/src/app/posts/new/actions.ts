"use server";

// Step 5: Server Action that redirects after a mutation
// This pattern: validate → save → revalidate → redirect

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  // In a real app: save to database
  // const post = await db.post.create({ data: { title, content } });
  console.log("Creating post:", { title, content });

  // Simulate a slug from the title
  const slug = title.toLowerCase().replace(/\s+/g, "-");

  // Bust the cache so the posts list shows the new entry
  revalidatePath("/posts");

  // Server Actions use 303 status code by default
  redirect(`/posts/${slug}`);
}
