import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Shirt = {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  image_url: string | null;
  purchase_price: number;
  selling_price: number;
  quantity_s: number;
  quantity_m: number;
  quantity_l: number;
  quantity_xl: number;
};

export default async function Home() {
  const { data: shirts, error } = await supabase
    .from("shirts")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  const safeShirts = (shirts || []) as Shirt[];

  const totalInventory = safeShirts.reduce(
    (total, shirt) =>
      total +
      shirt.quantity_s +
      shirt.quantity_m +
      shirt.quantity_l +
      shirt.quantity_xl,
    0
  );

  const totalPotentialRevenue = safeShirts.reduce(
    (total, shirt) =>
      total +
      (shirt.quantity_s +
        shirt.quantity_m +
        shirt.quantity_l +
        shirt.quantity_xl) *
        Number(shirt.selling_price),
    0
  );

  const totalPotentialProfit = safeShirts.reduce(
    (total, shirt) =>
      total +
      (shirt.quantity_s +
        shirt.quantity_m +
        shirt.quantity_l +
        shirt.quantity_xl) *
        (Number(shirt.selling_price) - Number(shirt.purchase_price)),
    0
  );

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
            <p className="text-3xl font-bold">{totalInventory}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Potential Revenue</h2>
            <p className="text-3xl font-bold">
              ${totalPotentialRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Potential Profit</h2>
            <p className="text-3xl font-bold text-green-400">
              ${totalPotentialProfit.toFixed(2)}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h2 className="text-gray-400">Listings</h2>
            <p className="text-3xl font-bold">{safeShirts.length}</p>
          </div>
        </div>

        <Link
          href="/add-shirt"
          className="inline-block bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold mb-8"
        >
          + Add Shirt
        </Link>

        <h2 className="text-2xl font-bold mb-4">Inventory</h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500 bg-red-950/40 p-4 text-red-200">
            {error.message}
          </div>
        )}

        {safeShirts.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-gray-400">
            No shirts yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeShirts.map((shirt) => {
              const totalQty =
                shirt.quantity_s +
                shirt.quantity_m +
                shirt.quantity_l +
                shirt.quantity_xl;

              const profit =
                Number(shirt.selling_price) - Number(shirt.purchase_price);

              return (
                <div
                  key={shirt.id}
                  className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                >
                  <div className="h-48 overflow-hidden bg-zinc-950">
  {shirt.image_url ? (
    <img
      src={shirt.image_url}
      alt={shirt.name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-6xl">
      👕
    </div>
  )}
</div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold">{shirt.name}</h3>
                    <p className="text-zinc-400">{shirt.brand || "No brand"}</p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-zinc-500">Bought</p>
                        <p className="font-bold">${Number(shirt.purchase_price).toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-zinc-500">Selling</p>
                        <p className="font-bold">${Number(shirt.selling_price).toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-zinc-500">Profit Each</p>
                        <p className="font-bold text-green-400">+${profit.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-zinc-500">Total Qty</p>
                        <p className="font-bold">{totalQty}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
                      <div className="rounded-lg border border-red-500/50 p-2">
                        S {shirt.quantity_s}
                      </div>
                      <div className="rounded-lg border border-red-500/50 p-2">
                        M {shirt.quantity_m}
                      </div>
                      <div className="rounded-lg border border-red-500/50 p-2">
                        L {shirt.quantity_l}
                      </div>
                      <div className="rounded-lg border border-red-500/50 p-2">
                        XL {shirt.quantity_xl}
                      </div>
                    </div>

                    <button className="mt-5 w-full rounded-xl bg-red-600 py-3 font-bold hover:bg-red-700">
                      Sell
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}