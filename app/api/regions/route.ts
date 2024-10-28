// app/api/regions/route.ts

import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// Fetch all regions
export async function GET() {
  try {
    const regions = await prisma.region.findMany();
    return NextResponse.json(regions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching regions", error },
      { status: 500 }
    );
  }
}

// POST endpoint in your API file
// POST endpoint in your API file
export const POST = async (req: NextRequest) => {
  try {
    const { name, deliveryDays, neighborhoods, startTime, endTime } =
      await req.json();

    // تحقق من أن البيانات الأساسية موجودة
    if (!name || !deliveryDays || !startTime || !endTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // التحقق فقط من وجود نفس الحي بدون التحقق من المنطقة
    const existingNeighborhood = await prisma.region.findFirst({
      where: {
        neighborhoods: neighborhoods, // التحقق من الحي فقط إذا كان محددًا
      },
    });

    // إذا كان اسم الحي موجودًا بالفعل
    if (existingNeighborhood) {
      return NextResponse.json(
        {
          message: "Neighborhood already exists",
        },
        { status: 409 }
      );
    }

    // إضافة المنطقة الجديدة
    const newRegion = await prisma.region.create({
      data: {
        name,
        deliveryDays, // يتم تخزينها كـ JSON تلقائيًا
        neighborhoods: neighborhoods || null,
        startTime,
        endTime,
      },
    });

    return NextResponse.json(newRegion, { status: 201 });
  } catch (error) {
    console.error("Error creating region:", error);
    return NextResponse.json(
      { message: "Error creating region" },
      { status: 500 }
    );
  }
};
