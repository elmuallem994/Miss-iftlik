"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeleteButton = ({ id }: { id: string }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // تحقق من حالة تحميل المستخدم
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  // تحقق من حالة المستخدم إذا كان غير مسجل دخوله أو ليس مشرفًا
  if (!isSignedIn || user?.publicMetadata?.role !== "admin") {
    return null;
  }

  const handleDelete = async () => {
    const res = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      router.push("/menu");
      toast("The product has been deleted!");
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  };

  return (
    <button
      className="bg-red-400 hover:bg-red-500 text-white p-2 rounded-full ml-6"
      onClick={handleDelete}
    >
      <Image src="/delete.png" alt="Delete" width={20} height={20} />
    </button>
  );
};

export default DeleteButton;
