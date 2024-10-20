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

    // إرجاع addressId و regionId
    return NextResponse.json({
      addressId: address.id, // إضافة معرف العنوان إلى الاستجابة
      regionId: address.regionId, // إرسال معرف المنطقة
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching address" },
      { status: 500 }
    );
  }
};
