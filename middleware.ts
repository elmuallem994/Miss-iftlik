import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/orders(.*)"]);
const isAdminRoute = createRouteMatcher(["/add(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // التحقق من تسجيل الدخول
  if (!userId && (isProtectedRoute(req) || isAdminRoute(req))) {
    return redirectToSignIn(); // إعادة التوجيه إلى صفحة تسجيل الدخول
  }

  // التحقق من أن userId ليس null
  if (!userId) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // جلب بيانات المستخدم فقط إذا تم الوصول إلى صفحة محمية
  const user = await clerkClient.users.getUser(userId);

  // التحقق من دور "admin"
  if (isAdminRoute(req) && user?.publicMetadata?.role !== "admin") {
    const url = new URL("/", req.url); // إعادة التوجيه إلى الصفحة الرئيسية
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
