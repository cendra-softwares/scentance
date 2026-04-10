"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="text-red-400" size={36} />
        </div>

        <div className="space-y-4">
          <h1 className="text-white text-2xl font-medium">Payment Failed</h1>
          <p className="text-white/40 text-sm max-w-xs mx-auto">
            Your payment could not be processed. No money has been charged.
          </p>

          {(orderId || code) && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-left">
              {orderId && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Order ID</span>
                  <span className="text-white/50 font-mono">{orderId}</span>
                </div>
              )}
              {code && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Error Code</span>
                  <span className="text-red-400/80 font-mono">{code}</span>
                </div>
              )}
            </div>
          )}

          {/* Common failure reasons */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left space-y-2">
            <h3 className="text-white/40 text-xs uppercase tracking-widest">
              Common Reasons
            </h3>
            <ul className="text-white/30 text-xs space-y-1.5">
              <li>• Insufficient balance (Z9)</li>
              <li>• Invalid UPI PIN (ZM)</li>
              <li>• Transaction cancelled by user (ZA)</li>
              <li>• Bank technical issue (U90)</li>
            </ul>
          </div>
        </div>

        <a
          href="/checkout"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-2xl px-8 py-3 font-medium text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <ArrowLeft size={16} />
          Back to Checkout
        </a>
      </div>
    </div>
  );
}

export default function CheckoutFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center"><div className="text-white/40">Loading...</div></div>}>
      <FailureContent />
    </Suspense>
  );
}
