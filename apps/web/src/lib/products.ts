// File-level "use cache" — every export in this file is cached.
// Next.js caches the RETURN VALUE, not the execution.
"use cache";

import { cacheLife, cacheTag } from "next/cache";

// -- Simulated product database --

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
  description: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 79.99,
    inventory: 42,
    description: "Premium noise-cancelling wireless headphones.",
  },
  {
    id: "2",
    name: "Mechanical Keyboard",
    price: 129.99,
    inventory: 15,
    description: "Cherry MX switches with RGB backlighting.",
  },
  {
    id: "3",
    name: "USB-C Hub",
    price: 49.99,
    inventory: 108,
    description: "7-in-1 hub with HDMI, USB-A, and SD card reader.",
  },
];

// Simulate network latency so you can see streaming in action
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch all products.
 * Tagged with 'products' so we can invalidate the entire list.
 */
export async function getProducts() {
  cacheLife("products");
  cacheTag("products");

  await delay(1000); // Simulate slow API call
  console.log("[products] getProducts() cache miss — fetching data");

  return products;
}

/**
 * Fetch a single product by ID.
 * Tagged with both 'products' (list) and 'product-{id}' (individual).
 * This lets us invalidate just one product OR the whole catalog.
 */
export async function getProduct(id: string) {
  cacheLife("products");
  cacheTag("products", `product-${id}`);

  await delay(800);
  console.log(`[products] getProduct(${id}) cache miss — fetching data`);

  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);

  return product;
}
