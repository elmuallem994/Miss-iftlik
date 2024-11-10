import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { neighborhoodName: string } }
) => {
  try {
    const { neighborhoodName } = params;

    // البحث في قاعدة البيانات عن الحي المطلوب
    const neighborhoodData = await prisma.region.findFirst({
      where: { neighborhoods: neighborhoodName },
    });

    if (!neighborhoodData) {
      return NextResponse.json(
        { message: "Neighborhood not found" },
        { status: 404 }
      );
    }

    // استخراج الأيام المتاحة للتوصيل وتحويلها إلى مصفوفة
    let deliveryDaysArray: string[] = [];
    if (typeof neighborhoodData.deliveryDays === "string") {
      deliveryDaysArray = neighborhoodData.deliveryDays
        .split(",")
        .map((day) => day.trim());
    } else if (Array.isArray(neighborhoodData.deliveryDays)) {
      deliveryDaysArray = neighborhoodData.deliveryDays.flatMap((day) =>
        typeof day === "string"
          ? day.split(",").map((d: string) => d.trim())
          : []
      );
    }

    // إرجاع اسم المنطقة والأيام المتاحة في الاستجابة
    return NextResponse.json({
      regionName: neighborhoodData.name,
      deliveryDays: deliveryDaysArray,
    });
  } catch (error) {
    console.error("Error fetching neighborhood data:", error);
    return NextResponse.json(
      { message: "Error fetching neighborhood data" },
      { status: 500 }
    );
  }
};
