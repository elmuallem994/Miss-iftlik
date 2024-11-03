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

    // التحقق من وجود المصفوفة بشكل صحيح
    const deliveryDays = region.deliveryDays;

    // التحقق مما إذا كانت المصفوفة فارغة
    if (!deliveryDays) {
      return NextResponse.json({
        message: "No delivery days available for this region",
        regionName: region.name,
        deliveryDays: [],
        startTime: region.startTime, // إضافة وقت البدء
        endTime: region.endTime, // إضافة وقت النهاية
      });
    }

    // إرجاع اسم المنطقة وأيام التوصيل ووقت التسليم
    return NextResponse.json({
      regionName: region.name,
      neighborhoods: region.neighborhoods,
      deliveryDays: deliveryDays, // إرجاع أيام التوصيل
      startTime: region.startTime, // إضافة وقت البدء
      endTime: region.endTime, // إضافة وقت النهاية
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
