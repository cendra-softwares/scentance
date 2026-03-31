import { NextRequest, NextResponse } from "next/server";
import { getPhonePeClient } from "@/lib/phonepe";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const client = getPhonePeClient();
    const response = await client.getOrderStatus(orderId);

    return NextResponse.json({
      success: true,
      state: response.state,
      orderId,
    });
  } catch (error) {
    console.error("PhonePe status check error:", error);
    return NextResponse.json(
      { error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
