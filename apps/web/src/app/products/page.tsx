import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/products";

// -- Static shell: this markup prerenders at build time --
export default function ProductsPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-gray-600 mt-2">
          Browse our catalog. This header is part of the static shell — it loads
          instantly.
        </p>
      </header>

      {/* Suspense creates a "dynamic hole" in the static shell.
          The fallback shows immediately while ProductGrid streams in. */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>

      <footer className="mt-12 pt-4 border-t text-sm text-gray-500">
        Static footer — also part of the prerendered shell.
      </footer>
    </div>
  );
}

// -- Dynamic hole: this component awaits cached data --
async function ProductGrid() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600 mt-1">{product.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-bold">${product.price}</span>
            <span className="text-sm text-gray-500">
              {product.inventory} in stock
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// -- Skeleton shown while cached data loads --
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 rounded mb-4" />
          <div className="flex justify-between">
            <div className="h-6 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
