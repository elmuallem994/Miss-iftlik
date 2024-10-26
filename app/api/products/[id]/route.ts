// app/api/products/[id]/route.ts

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

// PUT SINGLE PRODUCT (Update Product)
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { userId } = auth(); // Get userId from Clerk's auth method

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "User not authenticated!" }),
      {
        status: 401,
      }
    );
  }

  try {
    // Get user information from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Check if the user has the admin role using Clerk's publicMetadata
    if (user?.publicMetadata?.role === "admin") {
      // Parse the JSON body to get the updated product data
      const body = await req.json();

      // Update the product using Prisma
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          title: body.title,
          desc: body.desc,
          price: body.price,
          img: body.img,
          catSlug: body.catSlug,
        },
      });

      return new NextResponse(JSON.stringify(updatedProduct), {
        status: 200,
      });
    }

    // If the user is not an admin, return a 403 Forbidden response
    return new NextResponse(
      JSON.stringify({ message: "You are not allowed!" }),
      { status: 403 }
    );
  } catch (error) {
    console.log(error);
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
