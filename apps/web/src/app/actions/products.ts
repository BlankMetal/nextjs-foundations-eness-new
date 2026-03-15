// "use server" marks every export as a Server Action —
// callable from Client Components but runs only on the server.
"use server";

import { revalidateTag } from "next/cache";

interface UpdateProductData {
  name?: string;
  price?: number;
  inventory?: number;
}

export async function updateProduct(id: string, data: UpdateProductData) {
  // In a real app, this would write to a database:
  //   await db.products.update({ where: { id }, data })
  console.log(`[action] Updating product ${id}:`, data);

  // Simulate a short write delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Invalidate cache entries after the mutation.
  // The second argument 'max' uses stale-while-revalidate semantics:
  // it marks the cache as stale and serves old data while fetching fresh.
  revalidateTag(`product-${id}`, "max"); // Bust this specific product
  revalidateTag("products", "max"); // Bust the product listing too

  return { success: true };
}
