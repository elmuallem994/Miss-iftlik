import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// الصفحات المحمية التي تحتاج تسجيل دخول
const isProtectedRoute = createRouteMatcher(["/orders(.*)", "/address(.*)"]);

// الصفحات الخاصة بالمشرف والتي تتطلب دور "admin"
const isAdminRoute = createRouteMatcher([
  "/admin",
  "/add",
  "/addCategoryForm(.*)",
  "/regions(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // التحقق من صفحات محمية تتطلب تسجيل الدخول
  if (isProtectedRoute(req)) {
    if (!userId) {
      return redirectToSignIn(); // إعادة التوجيه إلى صفحة تسجيل الدخول
    }
  }

  // التحقق من صفحات المشرف التي تتطلب دور "admin"
  if (isAdminRoute(req)) {
    if (!userId) {
      return redirectToSignIn(); // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن مسجل دخول
    }

    // استدعاء clerkClient كدالة للحصول على المستخدم
    const client = clerkClient();
    // جلب بيانات المستخدم للتحقق من الدور
    const user = await client.users.getUser(userId);

    // التحقق من دور "admin"
    if (user?.publicMetadata?.role !== "admin") {
      const url = new URL("/", req.url); // إعادة التوجيه إلى الصفحة الرئيسية إذا لم يكن المشرف
      return NextResponse.redirect(url);
    }
  }

  // السماح بالوصول للصفحات غير المحمية
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
