// app/api/orders/[id]/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// CHANGE THE STATUS OF AN ORDER
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const { status } = await req.json(); // تأكد من استخراج status فقط

    await prisma.order.update({
      where: {
        id: id,
      },
      data: { status }, // تحديث حالة الطلب فقط
    });

    return new NextResponse(
      JSON.stringify({ message: "Order has been updated!" }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
