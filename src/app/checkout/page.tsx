"use client";

import { useState } from "react";
import { CreditCard, Loader2, AlertCircle } from "lucide-react";

const PRESET_AMOUNTS = [10, 50, 100, 500];

export default function CheckoutPage() {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;

    if (!finalAmount || finalAmount < 1) {
      setError("Minimum amount is ₹1");
      return;
    }
    if (finalAmount > 1000) {
      setError("Sandbox limit: max ₹1000");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/phonepe/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const data = await res.json();

      if (!data.success || !data.redirectUrl) {
        throw new Error(data.error || "Failed to create order");
      }

      // Redirect to PhonePe payment page
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <CreditCard className="text-purple-400" size={28} />
          </div>
          <h1 className="text-white text-2xl font-medium tracking-tight">
            PhonePe Test Checkout
          </h1>
          <p className="text-white/40 text-sm">
            Sandbox environment — no real money
          </p>
        </div>

        {/* Amount Selection */}
        <div className="space-y-4">
          <label className="text-white/40 text-xs uppercase tracking-widest ml-1">
            Select Amount
          </label>
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount("");
                  setError(null);
                }}
                className={`py-3 rounded-2xl text-sm font-medium transition-all ${
                  amount === preset && !customAmount
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label className="text-white/40 text-xs uppercase tracking-widest ml-1">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40">
                ₹
              </span>
              <input
                type="number"
                min="1"
                max="1000"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setError(null);
                }}
                placeholder="1 - 1000"
                className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-2xl pl-10 pr-5 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Test Credentials Info */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
          <h3 className="text-white/60 text-xs uppercase tracking-widest font-medium">
            Test Credentials
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-white/30">UPI (Success)</span>
              <span className="text-green-400/80 font-mono">success@ybl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">UPI (Failure)</span>
              <span className="text-red-400/80 font-mono">failed@ybl</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">Card</span>
              <span className="text-white/50 font-mono">
                4208 5851 9011 6667
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/30">CVV / OTP</span>
              <span className="text-white/50 font-mono">508 / 123456</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400 shrink-0" size={18} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-2xl py-4 font-medium text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating Order...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Pay ₹{customAmount || amount} with PhonePe
            </>
          )}
        </button>

        {/* Footer */}
        <p className="text-white/20 text-[10px] text-center uppercase tracking-widest">
          PhonePe Sandbox • No real transactions
        </p>
      </div>
    </div>
  );
}
