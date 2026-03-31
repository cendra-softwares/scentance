import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { StandardCheckoutPayRequest } from "@phonepe-pg/pg-sdk-node";
import { getPhonePeClient, getRedirectBaseUrl } from "@/lib/phonepe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    // Validate amount (PhonePe sandbox: ₹1 - ₹1000)
    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1" },
        { status: 400 }
      );
    }

    if (amount > 1000) {
      return NextResponse.json(
        { error: "Sandbox limit: max ₹1000" },
        { status: 400 }
      );
    }

    const client = getPhonePeClient();
    const merchantOrderId = `ORD-${randomUUID()}`;
    const amountInPaise = Math.round(amount * 100);
    const baseUrl = getRedirectBaseUrl();

    const payRequest = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaise)
      .redirectUrl(`${baseUrl}/checkout/success?orderId=${merchantOrderId}`)
      .build();

    const response = await client.pay(payRequest);

    return NextResponse.json({
      success: true,
      merchantOrderId,
      redirectUrl: response.redirectUrl,
    });
  } catch (error) {
    console.error("PhonePe create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
