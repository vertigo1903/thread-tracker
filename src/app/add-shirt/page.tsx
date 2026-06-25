"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddShirtPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [shirtName, setShirtName] = useState("");
  const [brand, setBrand] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [sizes, setSizes] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });

  const changeQty = (size: keyof typeof sizes, amount: number) => {
    setSizes((prev) => ({
      ...prev,
      [size]: Math.max(0, prev[size] + amount),
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveShirt = async () => {
    setMessage("");

    if (!shirtName.trim()) {
      setMessage("Add a shirt name first.");
      return;
    }

    if (!purchasePrice || !sellingPrice) {
      setMessage("Add purchase and selling prices.");
      return;
    }

    setSaving(true);

    let imageUrl: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("shirt-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setSaving(false);
        setMessage(`Image upload error: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("shirt-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("shirts").insert({
      sku: `TT-${Date.now()}`,
      name: shirtName,
      brand: brand,
      image_url: imageUrl,
      purchase_price: Number(purchasePrice),
      selling_price: Number(sellingPrice),
      quantity_s: sizes.S,
      quantity_m: sizes.M,
      quantity_l: sizes.L,
      quantity_xl: sizes.XL,
      archived: false,
    });

    setSaving(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }

    setMessage("Shirt saved successfully!");

    setShirtName("");
    setBrand("");
    setPurchasePrice("");
    setSellingPrice("");
    setSizes({ S: 0, M: 0, L: 0, XL: 0 });
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold hover:text-red-500"
          >
            <span className="text-3xl text-red-500">←</span>
            Back
          </Link>

          <h1 className="text-3xl font-bold">Add Shirt</h1>

          <div className="w-20" />
        </div>

        <div className="space-y-5 p-5 md:p-8">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-red-500/80 bg-black/30 text-center transition hover:bg-red-950/10"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Shirt preview"
                  className="h-full max-h-80 w-full rounded-2xl object-cover"
                />
              ) : (
                <>
                  <div className="mb-4 text-6xl text-red-500">📷</div>
                  <h2 className="text-2xl font-bold">Upload Photo</h2>
                  <p className="mt-2 text-zinc-400">
                    Click to choose an image
                  </p>
                </>
              )}
            </button>
          </div>

          <div className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <label className="block">
              <span className="mb-2 block text-lg font-bold">Shirt Name</span>
              <input
                type="text"
                value={shirtName}
                onChange={(e) => setShirtName(e.target.value)}
                placeholder="Enter shirt name"
                className="w-full rounded-xl border border-zinc-700 bg-black/40 p-4 text-lg outline-none focus:border-red-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-lg font-bold">Brand</span>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand"
                className="w-full rounded-xl border border-zinc-700 bg-black/40 p-4 text-lg outline-none focus:border-red-500"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-lg font-bold">
                  Purchase Price
                </span>
                <div className="flex items-center rounded-xl border border-zinc-700 bg-black/40 px-4 focus-within:border-red-500">
                  <span className="mr-3 text-2xl text-zinc-400">$</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent p-4 text-lg outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-lg font-bold">
                  Selling Price
                </span>
                <div className="flex items-center rounded-xl border border-zinc-700 bg-black/40 px-4 focus-within:border-red-500">
                  <span className="mr-3 text-2xl text-zinc-400">$</span>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent p-4 text-lg outline-none"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
            <h2 className="mb-4 text-2xl font-bold">Sizes</h2>

            <div className="divide-y divide-zinc-800">
              {Object.entries(sizes).map(([size, qty]) => (
                <div
                  key={size}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-2xl font-bold">{size}</span>

                  <div className="flex items-center gap-8">
                    <button
                      type="button"
                      onClick={() =>
                        changeQty(size as keyof typeof sizes, -1)
                      }
                      className="h-11 w-14 rounded-xl border border-red-500 text-3xl text-red-500 hover:bg-red-600 hover:text-white"
                    >
                      -
                    </button>

                    <span className="w-8 text-center text-2xl font-bold">
                      {qty}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        changeQty(size as keyof typeof sizes, 1)
                      }
                      className="h-11 w-14 rounded-xl border border-red-500 text-3xl text-red-500 hover:bg-red-600 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-200">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveShirt}
            disabled={saving}
            className="w-full rounded-2xl bg-red-600 py-5 text-2xl font-bold shadow-lg shadow-red-950/60 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "💾 Save Shirt"}
          </button>
        </div>
      </div>
    </main>
  );
}