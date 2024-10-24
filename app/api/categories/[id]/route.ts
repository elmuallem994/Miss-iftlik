// app/api/categories/[id]/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// GET CATEGORY BY ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found!" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(category), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// UPDATE CATEGORY BY ID
export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const { title, desc, color, img, slug } = await req.json();

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        title,
        desc,
        color,
        img,
        slug,
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// DELETE CATEGORY BY ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    await prisma.category.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({ message: "Category deleted successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
