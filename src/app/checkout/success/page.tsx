"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

type Status = "loading" | "success" | "failed" | "pending";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState<Status>("loading");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/phonepe/status/${orderId}`);
        const data = await res.json();

        if (data.state === "COMPLETED") {
          setStatus("success");
        } else if (data.state === "FAILED") {
          setStatus("failed");
        } else {
          // PENDING — follow PhonePe reconciliation schedule
          setStatus("pending");
          setAttempts((prev) => prev + 1);

          // Polling intervals per PhonePe docs:
          // every 3s for 30s, then 6s, then 10s, then 30s, then 1m
          let delay = 3000;
          if (attempts > 10) delay = 6000;
          if (attempts > 20) delay = 10000;
          if (attempts > 26) delay = 30000;
          if (attempts > 28) delay = 60000;

          // Stop after ~3 minutes
          if (attempts > 30) {
            setStatus("failed");
            return;
          }

          setTimeout(checkStatus, delay);
        }
      } catch {
        setStatus("failed");
      }
    };

    checkStatus();
  }, [orderId, attempts]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="text-purple-400 animate-spin" size={36} />
            </div>
            <div className="space-y-2">
              <h1 className="text-white text-2xl font-medium">
                Verifying Payment
              </h1>
              <p className="text-white/40 text-sm">
                Please wait while we confirm your payment...
              </p>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw className="text-yellow-400 animate-spin" size={36} />
            </div>
            <div className="space-y-2">
              <h1 className="text-white text-2xl font-medium">
                Payment Pending
              </h1>
              <p className="text-white/40 text-sm">
                Your payment is being processed. Checking status...
              </p>
              <p className="text-white/20 text-xs">
                Attempt {attempts} of 30
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="text-green-400" size={36} />
            </div>
            <div className="space-y-4">
              <h1 className="text-white text-2xl font-medium">
                Payment Successful
              </h1>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                <p className="text-white/40 text-xs uppercase tracking-widest">
                  Order ID
                </p>
                <p className="text-white text-lg font-mono break-all">
                  {orderId}
                </p>
              </div>
              <p className="text-white/40 text-sm">
                This is a sandbox test — no real money was charged.
              </p>
            </div>
            <a
              href="/checkout"
              className="inline-block bg-green-600 hover:bg-green-500 text-white rounded-2xl px-8 py-3 font-medium text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Test Another Payment
            </a>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="text-red-400" size={36} />
            </div>
            <div className="space-y-4">
              <h1 className="text-white text-2xl font-medium">
                Payment Failed
              </h1>
              <p className="text-white/40 text-sm">
                The payment could not be completed. This may be due to a test
                failure scenario or timeout.
              </p>
              {orderId && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-white/30 text-xs">
                    Order: <span className="font-mono">{orderId}</span>
                  </p>
                </div>
              )}
            </div>
            <a
              href="/checkout"
              className="inline-block bg-white/10 hover:bg-white/15 text-white rounded-2xl px-8 py-3 font-medium text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Try Again
            </a>
          </>
        )}
      </div>
    </div>
  );
}
