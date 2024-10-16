import prisma from "@/utils/connect";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET SINGLE PRODUCT
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    return new NextResponse(JSON.stringify(product), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// DELETE SINGLE PRODUCT
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { userId } = auth(); // جلب userId من auth

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "User not authenticated!" }),
      {
        status: 401,
      }
    );
  }

  try {
    // الحصول على بيانات المستخدم من Clerk
    const user = await clerkClient.users.getUser(userId);

    // تحقق من الدور باستخدام Clerk publicMetadata
    if (user?.publicMetadata?.role === "admin") {
      // حذف المنتج إذا كان المستخدم مسؤولاً
      await prisma.product.delete({
        where: {
          id: id,
        },
      });

      return new NextResponse(JSON.stringify("Product has been deleted!"), {
        status: 200,
      });
    }

    // في حالة عدم وجود صلاحيات للمستخدم
    return new NextResponse(
      JSON.stringify({ message: "You are not allowed!" }),
      { status: 403 }
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
