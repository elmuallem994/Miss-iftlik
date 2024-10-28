// app/api/regions/[regionId]/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { regionId: string } }
) => {
  try {
    const { regionId } = params;

    // Find the region by ID
    const region = await prisma.region.findUnique({
      where: { id: parseInt(regionId) },
    });

    if (!region) {
      return NextResponse.json(
        { message: "Region not found" },
        { status: 404 }
      );
    }

    // Get all regions with the same name as the fetched region
    const allRegionsWithSameName = await prisma.region.findMany({
      where: { name: region.name },
    });

    // Combine all neighborhoods from all fetched regions
    const allNeighborhoods = allRegionsWithSameName.flatMap((r) =>
      r.neighborhoods
        ? r.neighborhoods.split(",").map((neigh) => neigh.trim())
        : []
    );

    // تحقق مما إذا كان حقل الأحياء فارغًا وأعد رسالة تشير إلى أن جميع الأحياء متاحة
    let responseMessage;
    if (allNeighborhoods.length === 0) {
      responseMessage = "جميع الأحياء متاحة";
    } else {
      responseMessage = Array.from(new Set(allNeighborhoods)); // Unique neighborhoods
    }

    // Return unique neighborhoods list or a message indicating all are available
    return NextResponse.json({
      regionName: region.name,
      neighborhoods: responseMessage,
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
  const regionId = parseInt(params.regionId); // تحويل إلى رقم
  const { name, deliveryDays, neighborhoods, startTime, endTime } =
    await req.json();

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
    data: {
      name, // تحديث الاسم
      deliveryDays, // تحديث أيام التسليم
      neighborhoods, // تحديث الحي (إذا وُجد)
      startTime, // تحديث وقت البدء
      endTime, // تحديث وقت النهاية
    },
  });

  return NextResponse.json(updatedRegion, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { regionId: string } }
) {
  const regionId = parseInt(params.regionId); // تحويل المعرف إلى رقم

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

    // حذف جميع العناوين المرتبطة بالمنطقة التي تحمل نفس المعرف فقط
    await prisma.address.deleteMany({
      where: { regionId: regionId }, // تأكيد استخدام المعرف المحدد فقط
    });

    // حذف المنطقة بعد حذف العناوين المرتبطة بها فقط
    await prisma.region.delete({
      where: { id: regionId },
    });

    return NextResponse.json(
      {
        message: `Region with ID ${regionId} and related addresses deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting region and addresses:", error);
    return NextResponse.json(
      { message: "Error deleting region and addresses." },
      { status: 500 }
    );
  }
}
