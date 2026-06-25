import Link from "next/link";

export default function AddShirtPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-6 text-red-500 hover:text-red-400"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-red-500 mb-8">
          Add New Shirt
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Shirt Name"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Brand"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Purchase Price"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="Selling Price"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Small Qty"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Medium Qty"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Large Qty"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="XL Qty"
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-3"
            />
          </div>

          <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold">
            Save Shirt
          </button>
        </div>
      </div>
    </main>
  );
}