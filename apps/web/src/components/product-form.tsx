"use client";

import { useState } from "react";
import { updateProduct } from "@/app/actions/products";

interface Product {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

export function ProductForm({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");

    // Calls the Server Action — runs on the server, not in the browser.
    // After it calls revalidateTag(), Next.js knows to refetch cached data.
    const result = await updateProduct(product.id, {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      inventory: Number(formData.get("inventory")),
    });

    setLoading(false);
    setMessage(result.success ? "Product updated! Cache invalidated." : "Failed to update.");
  }

  return (
    <form action={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={product.name}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
          Inventory
        </label>
        <input
          id="inventory"
          name="inventory"
          type="number"
          defaultValue={product.inventory}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p className={message.includes("updated") ? "text-green-600" : "text-red-600"}>
          {message}
        </p>
      )}
    </form>
  );
}
