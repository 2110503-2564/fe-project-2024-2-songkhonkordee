import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// ใช้ withAuth เป็น default export และกำหนด callbacks เพื่อควบคุมการเข้าถึง
export default withAuth(
  function middleware(req) {
    const url = req.nextUrl.pathname;
    console.log("Middleware hit:", url); // Debug log

    // ให้เข้าถึงหน้าร้านอาหารได้โดยไม่ต้องล็อกอิน
    if (
      url === "/restaurant" ||
      (url.startsWith("/restaurant/") && !url.includes("/order"))
    ) {
      return NextResponse.next();
    }

    // ส่วนที่เหลือให้ตรวจสอบการล็อกอินตามปกติ
    return NextResponse.next();
  },
  {
    callbacks: {
      // เงื่อนไขการตรวจสอบว่าได้รับอนุญาตหรือไม่
      authorized: ({ req, token }) => {
        const url = req.nextUrl.pathname;

        // ยกเว้นเส้นทางที่ไม่ต้องล็อกอิน
        if (
          url === "/restaurant" ||
          (url.startsWith("/restaurant/") && !url.includes("/order"))
        ) {
          return true;
        }

        // เส้นทางอื่นๆ ต้องมี token (ล็อกอินแล้ว)
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/myreview",
    "/mybooking",
    "/admin/booking",
    "/admin/review",
    "/restaurant/:path*", // รวมทุกเส้นทางภายใต้ /restaurant
  ],
};
