import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export function middleware(req) {
  const url = req.nextUrl.pathname;
  console.log("Middleware hit:", url); // Debug log

  // ยกเว้น /restaurant ไม่ต้องล็อกอิน
  if (url === "/restaurant") {
    return NextResponse.next();
  }

  // บังคับล็อกอินทุกเส้นทางอื่นๆ ที่อยู่ใน matcher
  return withAuth(req);
}

export const config = {
  matcher: [
    "/myreview",
    "/mybooking",
    "/admin/booking",
    "/admin/review",
    "/restaurant/:id*", // ต้องล็อกอินถ้ามีอะไรมาต่อท้าย /restaurant/ เช่น /restaurant/123
  ],
};
