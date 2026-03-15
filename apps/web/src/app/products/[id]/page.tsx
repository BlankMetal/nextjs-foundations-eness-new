import { Suspense } from "react";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { ProductForm } from "@/components/product-form";

// In Next.js 16, params is a Promise that must be awaited
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      {/* Static shell — prerenders instantly */}
      <header className="mb-8">
        <Link href="/products" className="text-blue-600 hover:underline">
          &larr; Back to Products
        </Link>
        <h1 className="text-3xl font-bold mt-2">Product Details</h1>
      </header>

      {/* Dynamic hole — cached product data streams in */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={id} />
      </Suspense>

      <footer className="mt-12 pt-4 border-t text-sm text-gray-500">
        Static footer — part of the prerendered shell.
      </footer>
    </div>
  );
}

async function ProductDetails({ id }: { id: string }) {
  const product = await getProduct(id);

  return (
    <div className="border rounded-lg p-8">
      <h2 className="text-2xl font-semibold">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded p-4">
          <p className="text-sm text-gray-500">Price</p>
          <p className="text-2xl font-bold">${product.price}</p>
        </div>
        <div className="bg-gray-50 rounded p-4">
          <p className="text-sm text-gray-500">Inventory</p>
          <p className="text-2xl font-bold">{product.inventory} units</p>
        </div>
      </div>

      {/* Client Component — handles form interaction and calls the Server Action */}
      <ProductForm product={product} />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="border rounded-lg p-8 animate-pulse">
      <div className="h-8 w-56 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 rounded mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 rounded p-4">
          <div className="h-4 w-12 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
        <div className="bg-gray-100 rounded p-4">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
