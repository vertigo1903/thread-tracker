"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Shirt = {
  id: string;
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

export default function SellPage() {
  const params = useParams();
  const router = useRouter();

  const [shirt, setShirt] = useState<Shirt | null>(null);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [message, setMessage] = useState("");
  const [selling, setSelling] = useState(false);
  const [saleComplete, setSaleComplete] = useState(false);

  useEffect(() => {
    const fetchShirt = async () => {
      const { data, error } = await supabase
        .from("shirts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setShirt(data);
    };

    fetchShirt();
  }, [params.id]);

  const getQty = (size: "S" | "M" | "L" | "XL") => {
    if (!shirt) return 0;
    if (size === "S") return shirt.quantity_s;
    if (size === "M") return shirt.quantity_m;
    if (size === "L") return shirt.quantity_l;
    return shirt.quantity_xl;
  };

  const getColumn = (size: "S" | "M" | "L" | "XL") => {
    if (size === "S") return "quantity_s";
    if (size === "M") return "quantity_m";
    if (size === "L") return "quantity_l";
    return "quantity_xl";
  };

  const completeSale = async () => {
    if (!shirt) return;

    const currentQty = getQty(selectedSize);

    if (currentQty <= 0) {
      setMessage("That size is sold out.");
      return;
    }

    setSelling(true);
    setMessage("");

    const column = getColumn(selectedSize);
    const newQty = currentQty - 1;

    const revenue = Number(shirt.selling_price);
    const profit = Number(shirt.selling_price) - Number(shirt.purchase_price);

    const { error: updateError } = await supabase
      .from("shirts")
      .update({ [column]: newQty })
      .eq("id", shirt.id);

    if (updateError) {
      setSelling(false);
      setMessage(updateError.message);
      return;
    }

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setSelling(false);
  setMessage("You must be logged in to sell a shirt.");
  return;
}

const { error: saleError } = await supabase.from("sales").insert({
  user_id: user.id,
  shirt_id: shirt.id,
  size: selectedSize,
  quantity: 1,
  revenue,
  profit,
});

    if (saleError) {
      setSelling(false);
      setMessage(saleError.message);
      return;
    }

    setSaleComplete(true);

    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  if (!shirt) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        Loading...
      </main>
    );
  }

  const profit = Number(shirt.selling_price) - Number(shirt.purchase_price);

  if (saleComplete) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-6 text-8xl">✅</div>

          <h1 className="text-5xl font-bold text-green-400">
            Sale Completed!
          </h1>

          <p className="mt-4 text-xl text-zinc-300">
            Inventory updated successfully.
          </p>

          <p className="mt-2 text-green-400 text-3xl font-bold">
            +${profit.toFixed(2)}
          </p>

          <p className="mt-8 text-zinc-500">
            Returning to dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.25),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.65),rgba(0,0,0,1))]" />

      <div className="fixed inset-0 backdrop-blur-md" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-red-950/30">
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
            <Link href="/" className="text-red-500 hover:text-red-400">
              ← Cancel
            </Link>

            <h1 className="text-2xl font-bold">Sell Shirt</h1>

            <div className="w-16" />
          </div>

          <div className="p-6">
            <div className="mb-5 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 transition-all duration-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-600/30 hover:-translate-y-1">
              {shirt.image_url ? (
                <img
                  src={shirt.image_url}
                  alt={shirt.name}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center text-7xl">
                  👕
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold">{shirt.name}</h2>
            <p className="text-zinc-400">{shirt.brand || "No brand"}</p>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
              <h3 className="mb-4 text-lg font-bold">Choose Size</h3>

              <div className="grid grid-cols-4 gap-3">
                {(["S", "M", "L", "XL"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={getQty(size) <= 0}
                    className={`rounded-2xl border p-4 font-bold transition ${
                      selectedSize === size
                        ? "border-red-500 bg-red-600 shadow-lg shadow-red-950"
                        : "border-zinc-700 bg-black hover:border-red-500"
                    } disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    {size}
                    <div className="mt-1 text-xs text-zinc-300">
                      {getQty(size)} left
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                <p className="text-zinc-400">Revenue</p>
                <p className="text-3xl font-bold">
                  ${Number(shirt.selling_price).toFixed(2)}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
                <p className="text-zinc-400">Profit</p>
                <p className="text-3xl font-bold text-green-400">
                  +${profit.toFixed(2)}
                </p>
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-xl border border-red-500 bg-red-950/40 p-4 text-red-200">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={completeSale}
              disabled={selling}
              className="mt-6 w-full rounded-2xl bg-red-600 py-5 text-xl font-bold shadow-lg shadow-red-950/70 hover:bg-red-700 disabled:opacity-60"
            >
              {selling ? "Completing Sale..." : "Complete Sale"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}