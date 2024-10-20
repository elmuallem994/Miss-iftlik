// app/api/regions/[regionId]/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// Fetch available delivery days for a specific region and its name from the database
export const GET = async (
  req: NextRequest,
  { params }: { params: { regionId: string } }
) => {
  try {
    const { regionId } = params;

    // Fetch region data based on regionId
    const region = await prisma.region.findUnique({
      where: {
        id: parseInt(regionId), // تأكد من تحويل regionId إلى عدد صحيح
      },
    });

    if (!region) {
      return NextResponse.json(
        { message: "Region not found" },
        { status: 404 }
      );
    }

    const availableDays = region.deliveryDays; // الأيام المتاحة للتسليم

    // تحويل الأيام إلى مصفوفة
    let deliveryDaysArray: string[] = [];

    if (typeof availableDays === "string") {
      deliveryDaysArray = availableDays.split(",").map((day) => day.trim());
    } else if (Array.isArray(availableDays)) {
      deliveryDaysArray = availableDays.flatMap((day: any) =>
        typeof day === "string"
          ? day.split(",").map((d: string) => d.trim())
          : []
      );
    }

    // Return region name and available delivery days as an array
    return NextResponse.json({
      regionName: region.name, // اسم المنطقة
      deliveryDays: deliveryDaysArray, // الأيام المتاحة بعد التحويل إلى مصفوفة
    });
  } catch (error) {
    console.error("Error fetching region data:", error);
    return NextResponse.json(
      { message: "Error fetching region data" },
      { status: 500 }
    );
  }
};

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
