"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa"; // مكتبة الأيقونات

type EntryType = {
  id: number; // إضافة حقل 'id' هنا
  name: string;
  neighborhoods: string | null;
  deliveryDays: string[];
  startTime: string;
  endTime: string;
};

const allDays = [
  "الإثنين", // Monday
  "الثلاثاء", // Tuesday
  "الأربعاء", // Wednesday
  "الخميس", // Thursday
  "الجمعة", // Friday
  "السبت", // Saturday
  "الأحد", // Sunday
];

const ManageLocations = () => {
  const [region, setRegion] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [editingRegionId, setEditingRegionId] = useState<number | null>(null);

  // Handle day selection
  const handleDayChange = (day: string, isChecked: boolean) => {
    setSelectedDays((prevDays) =>
      isChecked ? [...prevDays, day] : prevDays.filter((d) => d !== day)
    );
  };

  // Fetch existing entries from API on page load
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/regions", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("فشل جلب الإدخالات");
        }

        const data = await response.json();
        setEntries(data);
      } catch (error) {
        toast.error("فشل تحميل الإدخالات");
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  // Handle adding new entry and saving it to API
  const handleAddEntry = async () => {
    if (
      region &&
      neighborhoods &&
      selectedDays.length > 0 &&
      startTime &&
      endTime
    ) {
      const newEntry = {
        name: region,
        deliveryDays: selectedDays, // لا تحتاج لتحويل JSON هنا
        neighborhoods: neighborhoods,
        startTime: startTime,
        endTime: endTime,
      };

      // إرسال البيانات إلى الخادم
      const response = await fetch("http://localhost:3000/api/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (response.status === 409) {
        toast.error("المنطقة التي تحمل نفس الاسم والحي موجودة بالفعل.");
        return;
      }

      if (!response.ok) {
        toast.error("فشل حفظ الإدخال.");
        return;
      }

      // جلب البيانات المحدثة
      const savedEntry = await response.json();
      setEntries([...entries, savedEntry]);
      // إعادة تعيين المدخلات
      setRegion("");
      setNeighborhoods(null);
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
    } else {
      toast.error("برجاء ملء كافة الحقول واختيار أيام التسليم.");
    }
  };

  const handleEdit = (entry: EntryType & { id: number }) => {
    setEditingRegionId(entry.id); // Store the ID of the region being edited
    setRegion(entry.name);
    setNeighborhoods(entry.neighborhoods);
    setSelectedDays(entry.deliveryDays);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
  };

  // إرسال طلب التعديل
  const handleUpdateEntry = async (regionId: number) => {
    // Construct updated entry data
    const updatedEntry = {
      name: region,
      deliveryDays: selectedDays,
      neighborhoods: neighborhoods,
      startTime: startTime,
      endTime: endTime,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/regions/${regionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEntry),
        }
      );

      if (!response.ok) {
        toast.error("فشل تحديث المنطقة.");
        return;
      }

      // Refresh entries with updated data
      const updatedData = await response.json();
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === regionId ? { ...entry, ...updatedData } : entry
        )
      );

      // Reset editing mode and clear the input fields
      setEditingRegionId(null);
      setRegion("");
      setNeighborhoods(null);
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
      toast.success("تم تحديث المنطقة بنجاح.");
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error("حدث خطأ أثناء تحديث المنطقة.");
    }
  };

  const handleDelete = async (regionId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/regions/${regionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        toast.error("فشل حذف المنطقة.");
        return;
      }

      // تحديث الإدخالات بعد الحذف
      setEntries(entries.filter((entry) => entry.id !== regionId));
      toast.success("تم حذف المنطقة بنجاح.");
    } catch (error) {
      console.error("Error deleting region:", error);
      toast.error("حدث خطأ أثناء حذف المنطقة.");
    }
  };

  return (
    <div className="main-content flex items-center justify-center p-4 sm:p-6 lg:p-8 ">
      <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full md:w-2/3">
        <h1 className="text-xl text-orange-400 sm:text-2xl font-bold">
          إدارة المناطق
        </h1>
        <Separator className="my-4" />

        {/* Region Input */}
        <div className="flex flex-col gap-4 mb-4 w-full md:w-1/3">
          <Input
            placeholder="أدخل المنطقة"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Neighborhood Input */}
        <div className="flex flex-col gap-4 mb-4 w-full md:w-1/3">
          <Input
            placeholder="أدخل الحي"
            value={neighborhoods || ""}
            onChange={(e) => setNeighborhoods(e.target.value || null)}
            className="w-full"
          />
        </div>

        {/* Days of the Week Selection */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {allDays.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={(e) => handleDayChange(day, e.target.checked)}
                className="mr-1"
              />
              <label>{day}</label>
            </div>
          ))}
        </div>

        {/* Delivery Time Selection */}
        <div className="flex flex-col gap-4 mb-4">
          <label className="text-lg font-semibold">موعد التسليم:</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-lg p-2 border border-gray-300 rounded-md w-full sm:w-auto"
            />
            <span className="text-lg font-semibold flex items-center">الى</span>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="text-lg p-2 border border-gray-300 rounded-md w-full sm:w-auto"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            if (editingRegionId) {
              handleUpdateEntry(editingRegionId);
            } else {
              handleAddEntry();
            }
          }}
          className="w-full sm:w-auto"
        >
          {editingRegionId ? "تحديث الإدخال" : "إضافة إدخال"}
        </Button>

        {/* عرض الإدخالات في جدول */}
        <div className="overflow-x-auto">
          <table className="min-w-full  border-collapse mt-4">
            <thead>
              <tr>
                <th className="border p-2">منطقة</th>
                <th className="border p-2">حيّ</th>
                <th className="border p-2">أيام التسليم</th>
                <th className="border p-2">وقت البدء</th>
                <th className="border p-2">وقت النهاية</th>
                <th className="border p-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{entry.name}</td>
                  <td className="border p-2">
                    {entry.neighborhoods ? entry.neighborhoods : "جميع الأحياء"}
                  </td>
                  <td className="border p-2">
                    {Array.isArray(entry.deliveryDays)
                      ? entry.deliveryDays.join(", ")
                      : entry.deliveryDays}
                  </td>
                  <td className="border p-2">{entry.startTime}</td>
                  <td className="border p-2">{entry.endTime}</td>
                  <td className="border p-2 flex gap-2">
                    <button onClick={() => handleEdit(entry)}>
                      <FaEdit className="text-blue-600 " />
                    </button>
                    <button onClick={() => handleDelete(entry.id)}>
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageLocations;
