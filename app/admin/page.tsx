import Link from "next/link";
import { Button } from "@/app/components/ui/button"; // استيراد زر من المكتبة المستخدمة

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl   mb-32 glowing-text text-center text-white font-extralight ">
        لوحة تحكم المشرف
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* رابط لإضافة فئة */}
        <Link href="/addCategoryForm">
          <Button
            variant="secondary"
            className="w-full h-16 md:h-32 text-xl font-bold bg-green-500 text-white"
          >
            إضافة صنف
          </Button>
        </Link>

        {/* رابط لإضافة منتج */}
        <Link href="/add">
          <Button
            variant="secondary"
            className="w-full h-16 md:h-32 text-xl font-bold bg-red-500 text-white"
          >
            إضافة منتج
          </Button>
        </Link>

        {/* رابط لإدارة المناطق */}
        <Link href="/regions">
          <Button
            variant="secondary"
            className="w-full h-16 md:h-32 text-xl font-bold bg-green-500 text-white"
          >
            إدارة المناطق
          </Button>
        </Link>

        {/* رابط لعرض الطلبات */}
        <Link href="/orders">
          <Button
            variant="secondary"
            className="w-full h-16 md:h-32 text-xl font-bold bg-red-500 text-white"
          >
            عرض الطلبات
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
