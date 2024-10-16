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

// Create a new region with deliveryDays stored as JSON array
export async function POST(req: NextRequest) {
  try {
    const regionsToAdd = await req.json();

    // قائمة المناطق الجديدة التي لم تُضاف بعد
    const newRegions = [];

    for (const region of regionsToAdd) {
      const existingRegion = await prisma.region.findUnique({
        where: { name: region.name },
      });

      // إذا لم تكن المنطقة موجودة بالفعل، قم بإضافتها
      if (!existingRegion) {
        const newRegion = await prisma.region.create({
          data: {
            name: region.name,
            deliveryDays: region.deliveryDays, // تخزين الأيام الجديدة
          },
        });
        newRegions.push(newRegion);
      }
    }

    return NextResponse.json(newRegions, { status: 201 });
  } catch (error) {
    console.error("Error creating regions:", error);
    return NextResponse.json(
      { message: "Error creating regions" },
      { status: 500 }
    );
  }
}

