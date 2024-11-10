// app/api/orders/[id]/route.ts

import prisma from "@/utils/connect";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Not authenticated!" }), {
      status: 401,
    });
  }

  const { id } = params;

  try {
    // جلب الطلب مع التفاصيل بناءً على `id`
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: {
          include: {
            region: true, // تضمين بيانات المنطقة
          },
        },
        region: true,
        orderItems: true, // تضمين العناصر المرتبطة بالطلب
      },
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Order not found!" }), {
        status: 404,
      });
    }

    const client = clerkClient(); // استدعاء clerkClient كدالة

    // التحقق مما إذا كان المستخدم الحالي هو نفس صاحب الطلب أو مشرف
    const user = await client.users.getUser(userId);
    if (user.publicMetadata.role !== "admin" && order.userId !== userId) {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
      });
    }

    return new NextResponse(JSON.stringify(order), { status: 200 });
  } catch (err) {
    console.error("Error fetching order details:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!", error: err.message }),
      { status: 500 }
    );
  }
};

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
