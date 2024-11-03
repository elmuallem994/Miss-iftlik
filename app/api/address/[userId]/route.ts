// app/api/address/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/connect";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params;

    // جلب العنوان بناءً على userId
    const address = await prisma.address.findFirst({
      where: { userId },
      include: { region: true },
    });

    if (!address || !address.region) {
      return NextResponse.json(
        { message: "Address or region not found" },
        { status: 404 }
      );
    }

    // إرجاع جميع تفاصيل العنوان مع المنطقة
    return NextResponse.json({
      addressId: address.id,
      il: address.il,
      adres: address.adres,
      regionId: address.regionId,
      regionName: address.region.name,
      neighborhoods: address.region.neighborhoods, // إضافة الحي من المنطقة
      startTime: address.region.startTime, // إضافة وقت البدء من المنطقة
      endTime: address.region.endTime, // إضافة وقت الانتهاء من المنطقة
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching address" },
      { status: 500 }
    );
  }
};
