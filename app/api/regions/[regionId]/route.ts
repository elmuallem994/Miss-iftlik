import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// app/api/regions/[regionId]/route.ts

export async function PUT(
  req: NextRequest,
  { params }: { params: { regionId: string } }
) {
  const regionId = parseInt(params.regionId); // Convert to number
  const { deliveryDays } = await req.json();

  // تحقق مما إذا كانت المنطقة موجودة
  const existingRegion = await prisma.region.findUnique({
    where: { id: regionId },
  });

  if (!existingRegion) {
    // إذا كانت المنطقة غير موجودة، أعد رسالة خطأ
    return NextResponse.json(
      { message: "Region not found. Cannot update a non-existing region." },
      { status: 404 }
    );
  }

  // تحديث المنطقة إذا كانت موجودة
  const updatedRegion = await prisma.region.update({
    where: { id: regionId },
    data: { deliveryDays },
  });

  return NextResponse.json(updatedRegion, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { regionId: string } }
) {
  const regionId = parseInt(params.regionId); // Convert to number

  try {
    // تحقق مما إذا كانت المنطقة موجودة
    const existingRegion = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!existingRegion) {
      return NextResponse.json(
        { message: "Region not found. Cannot delete a non-existing region." },
        { status: 404 }
      );
    }

    // حذف المنطقة إذا كانت موجودة
    await prisma.region.delete({
      where: { id: regionId },
    });

    return NextResponse.json(
      { message: `Region with ID ${regionId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting region:", error);
    return NextResponse.json(
      { message: "Error deleting region." },
      { status: 500 }
    );
  }
}
