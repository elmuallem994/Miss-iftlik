// app/api/categories/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// FETCH ALL CATEGORIES
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();

    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// ADD A NEW CATEGORY
export const POST = async (req: NextRequest) => {
  try {
    const { title, desc, img, slug } = await req.json();

    // التحقق من وجود القيم المطلوبة
    if (!title || !desc || !img || !slug) {
      return new NextResponse(
        JSON.stringify({ message: "All fields are required!" }),
        { status: 400 }
      );
    }

    // إضافة الصنف الجديد
    const newCategory = await prisma.category.create({
      data: {
        title,
        desc,
        img,
        slug,
      },
    });

    return new NextResponse(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to create category!" }),
      { status: 500 }
    );
  }
};
