import prisma from "@/utils/connect";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

// FETCH ALL ORDERS
export const GET = async () => {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse(JSON.stringify({ message: "Not authenticated!" }), {
      status: 401,
    });
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role === "admin") {
      const orders = await prisma.order.findMany();
      return new NextResponse(JSON.stringify(orders), { status: 200 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: userId },
    });

    return new NextResponse(JSON.stringify(orders), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// CREATE ORDER
export const POST = async (req: NextRequest) => {
  const { userData, orderData } = await req.json();

  try {
    // تحقق مما إذا كان المستخدم موجودًا بالفعل في قاعدة البيانات
    let user = await prisma.user.findUnique({
      where: {
        id: userData.id,
      },
    });

    // إذا لم يكن المستخدم موجودًا، قم بإنشائه
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        },
      });
    }

    // الآن قم بإنشاء الطلب للمستخدم
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        price: orderData.price,
        products: orderData.products,
        status: orderData.status,
        regionId: orderData.regionId,
        deliveryDate: orderData.deliveryDate,
      },
    });

    return new NextResponse(JSON.stringify(order), { status: 201 });
  } catch (err) {
    console.log("Error:", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
