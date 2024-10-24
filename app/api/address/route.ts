// app/api/address/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/utils/connect";

// API لإنشاء عنوان جديد
export async function POST(req: NextRequest) {
  try {
    const { il, ilce, mahalle, adres, regionId } = await req.json(); // إضافة regionId

    const { userId } = auth(); // جلب معرف المستخدم من Clerk

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated!" },
        { status: 401 }
      );
    }

    // تحقق مما إذا كان المستخدم موجودًا بالفعل في قاعدة البيانات
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // إذا لم يكن المستخدم موجودًا، قم بإنشائه
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId); // جلب بيانات المستخدم من Clerk
      user = await prisma.user.create({
        data: {
          id: userId,
          name: clerkUser.fullName || "Unknown Name",
          email: clerkUser.emailAddresses[0]?.emailAddress || "Unknown Email",
          phoneNumber:
            clerkUser.phoneNumbers[0]?.phoneNumber || "Unknown Phone", // جلب أول رقم هاتف إذا كان موجودًا
        },
      });
    }

    // تحقق من صحة regionId
    const region = await prisma.region.findUnique({
      where: { id: regionId }, // تأكد من أن المعرف موجود
    });

    if (!region) {
      return NextResponse.json(
        { message: "Invalid region ID" },
        { status: 400 }
      );
    }

    // إنشاء عنوان جديد في قاعدة البيانات
    const newAddress = await prisma.address.create({
      data: {
        il,
        ilce,
        mahalle,
        adres,
        regionId, // إضافة معرف المنطقة
        userId, // ربط العنوان بمعرف المستخدم
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { message: "Error creating address", error },
      { status: 500 }
    );
  }
}

// API لجلب جميع العناوين الخاصة بالمستخدم
export async function GET() {
  try {
    const { userId } = auth(); // الحصول على معرف المستخدم من Clerk

    // إذا كان المستخدم غير مسجل دخول
    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated!" },
        { status: 401 }
      );
    }

    // جلب العناوين الخاصة بالمستخدم من قاعدة البيانات
    const addresses = await prisma.address.findMany({
      where: {
        userId, // جلب العناوين التي تتطابق مع معرف المستخدم
      },
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching addresses", error },
      { status: 500 }
    );
  }
}

// API لتعديل العنوان
export async function PUT(req: NextRequest) {
  try {
    const { il, ilce, mahalle, adres, regionId } = await req.json(); // جلب بيانات العنوان المعدل
    const { userId } = auth(); // جلب معرف المستخدم من Clerk

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated!" },
        { status: 401 }
      );
    }

    // تحديث العنوان في قاعدة البيانات بناءً على معرف المستخدم
    const updatedAddress = await prisma.address.updateMany({
      where: {
        userId, // جلب العنوان الذي يملكه المستخدم الحالي
      },
      data: {
        il,
        ilce,
        mahalle,
        adres,
        regionId,
      },
    });

    if (updatedAddress.count === 0) {
      return NextResponse.json(
        { message: "No address found to update!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Address updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { message: "Error updating address", error },
      { status: 500 }
    );
  }
}
