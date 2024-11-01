import prisma from "@/utils/connect";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

type OrderProduct = {
  id: string;
  title: string;
  desc: string;
  img: string;
  quantity: number;
  price: number;
};

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
      // جلب جميع الطلبات مع معلومات المستخدم والعناوين والعناصر المرتبطة
      const orders = await prisma.order.findMany({
        include: {
          user: true,
          address: {
            include: {
              region: true, // تضمين بيانات المنطقة
            },
          },
          region: true, // إذا كانت المنطقة مرتبطة مباشرة بالطلب
          orderItems: true, // تضمين العناصر المرتبطة بالطلب
        },
      });
      return new NextResponse(JSON.stringify(orders), { status: 200 });
    }

    // جلب الطلبات الخاصة بالمستخدم المسجل فقط مع معلومات المستخدم والعناوين والعناصر المرتبطة
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true, // تضمين العناصر المرتبطة بالطلب
      },
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
  try {
    const { userData, orderData } = await req.json();

    // تحقق مما إذا كان userData.id موجودًا
    if (!userData || !userData.id) {
      return new NextResponse(
        JSON.stringify({ message: "User ID is missing" }),
        { status: 400 } // خطأ في الطلب (Bad Request)
      );
    }

    // الآن قم بإنشاء الطلب للمستخدم
    const order = await prisma.order.create({
      data: {
        userId: userData.id,
        price: orderData.price,
        status: orderData.status,
        regionId: parseInt(orderData.regionId), // تأكد من تحويله إلى عدد صحيح
        deliveryDate: orderData.deliveryDay,
        addressId: parseInt(orderData.addressId), // تأكد من تحويله إلى عدد صحيح
        recipientInfo: orderData.recipientInfo, // تخزين معلومات المستلم
      },
    });

    // إنشاء السجلات في جدول OrderItems لكل منتج في الطلب
    const orderItems = orderData.products.map((product: OrderProduct) => ({
      orderId: order.id,
      productId: product.id,
      title: product.title,
      desc: product.desc || null,
      img: product.img || null,
      quantity: product.quantity,
      price: product.price,
    }));

    // حفظ السجلات في جدول OrderItems
    await prisma.orderItem.createMany({ data: orderItems });

    return new NextResponse(JSON.stringify(order), { status: 201 });
  } catch (err) {
    console.log("Error:", err); // طباعة تفاصيل الخطأ في الكونسول
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!", error: err.message }),
      { status: 500 }
    );
  }
};
