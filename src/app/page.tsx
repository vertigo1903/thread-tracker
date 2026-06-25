import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 mb-2">
          🧵 Thread Tracker
        </h1>

        <p className="text-gray-400 mb-8">
          Inventory and profit tracking for your reselling business
        </p>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Inventory</h2>
            <p className="text-3xl font-bold">0</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Revenue</h2>
            <p className="text-3xl font-bold">$0</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Profit</h2>
            <p className="text-3xl font-bold text-green-400">$0</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Sold</h2>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <Link href="/add-shirt">
          <button className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold mb-8">
            + Add Shirt
          </button>
        </Link>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4">Inventory</h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-gray-400">
          No shirts yet.
        </div>
      </div>
    </main>
  );
}