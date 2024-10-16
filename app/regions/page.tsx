"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";

// تعريف النوع الخاص بالمناطق
type RegionType = {
  id?: number; // `id` سيكون غير موجود للمناطق الجديدة
  name: string;
  deliveryDays: string[]; // حفظ أيام التسليم كمصفوفة JSON
  isNew?: boolean; // لتحديد ما إذا كانت المنطقة جديدة
};

// أيام الأسبوع
const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ManageRegions = () => {
  const [regions, setRegions] = useState<RegionType[]>([]); // تخزين المناطق والأيام
  const [newRegionName, setNewRegionName] = useState(""); // تخزين اسم المنطقة الجديدة
  const [error, setError] = useState(""); // تخزين أي أخطاء
  const [selectedRegion, setSelectedRegion] = useState<RegionType | null>(null); // المنطقة المحددة للتحديث
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // اليوم المحدد للتحديث

  // جلب المناطق من API عند تحميل الصفحة
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/regions");
        const data = await res.json();
        setRegions(data); // تخزين البيانات المجلوبة في الحالة
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  // طلب تغيير الأيام
  const handleDayChangeRequest = (region: RegionType, day: string) => {
    if (region.isNew) {
      toast.error(
        "You can't modify delivery days for a new region until it's saved."
      );
      return;
    }
    setSelectedRegion(region);
    setSelectedDay(day);
  };

  // تأكيد تغيير اليوم
  const handleConfirmDayChange = async () => {
    if (!selectedRegion || !selectedDay) return;

    const updatedRegions = regions.map((region) =>
      region.id === selectedRegion.id
        ? {
            ...region,
            deliveryDays: region.deliveryDays.includes(selectedDay)
              ? region.deliveryDays.filter((d) => d !== selectedDay)
              : [...region.deliveryDays, selectedDay],
          }
        : region
    );

    setRegions(updatedRegions);

    try {
      const res = await fetch(
        `http://localhost:3000/api/regions/${selectedRegion.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliveryDays: updatedRegions.find(
              (region) => region.id === selectedRegion.id
            )?.deliveryDays,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update region ${selectedRegion.name}`);
      }

      toast.success(`Delivery day updated for ${selectedRegion.name}!`);
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error(`An error occurred while updating ${selectedRegion.name}`);
    }

    setSelectedRegion(null);
    setSelectedDay(null);
  };

  // إضافة منطقة جديدة
  const handleAddRegion = () => {
    if (newRegionName.trim() === "") {
      setError("Please enter a valid region name");
      return;
    }

    if (
      regions.some(
        (region) => region.name.toLowerCase() === newRegionName.toLowerCase()
      )
    ) {
      setError("Region already exists");
      return;
    }

    // إضافة المنطقة الجديدة مع تعيين `isNew` على true
    setRegions((prevRegions) => [
      ...prevRegions,
      { name: newRegionName, deliveryDays: [], isNew: true }, // لا يوجد id وتعتبر جديدة
    ]);

    setNewRegionName(""); // تفريغ الحقل بعد الإضافة
    setError(""); // مسح الأخطاء
  };

  // حذف منطقة معينة
  const handleDeleteRegion = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/regions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRegions((prevRegions) =>
          prevRegions.filter((region) => region.id !== id)
        );
        toast.success("Region deleted successfully");
      } else {
        toast.error("Failed to delete region");
      }
    } catch (error) {
      console.error("Error deleting region:", error);
      toast.error("An error occurred while deleting the region");
    }
  };

  // حفظ المنطقة الجديدة
  const handleSave = async () => {
    const newRegions = regions.filter((region) => region.isNew);
    const existingRegions = regions.filter((region) => !region.isNew);

    try {
      // حفظ المناطق الجديدة
      if (newRegions.length > 0) {
        const res = await fetch("http://localhost:3000/api/regions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRegions),
        });

        if (!res.ok) {
          throw new Error("Failed to save new regions");
        }

        const savedRegions = await res.json();

        setRegions((prevRegions) =>
          prevRegions.map((region) =>
            region.isNew
              ? {
                  ...region,
                  id: savedRegions.find((r: any) => r.name === region.name).id,
                  isNew: false,
                }
              : region
          )
        );

        toast.success("New regions saved successfully!");
      }
    } catch (error) {
      console.error("Error saving regions:", error);
      toast.error("An error occurred while saving the regions");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Manage Regions</h1>
      <Separator className="my-4" />

      {/* إضافة منطقة جديدة */}
      <div className="mb-4 flex items-center gap-4">
        <Input
          value={newRegionName}
          onChange={(e) => setNewRegionName(e.target.value)}
          placeholder="Enter new region name"
        />
        <Button onClick={handleAddRegion}>Add Region</Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* عرض المناطق */}
      {regions.length === 0 ? (
        <p>No regions found</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Region</th>
              {allDays.map((day) => (
                <th key={day} className="border p-2">
                  {day}
                </th>
              ))}
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr key={region.name} className="border">
                <td className="border p-2">{region.name}</td>
                {allDays.map((day) => (
                  <td key={day} className="border p-2 text-center">
                    <Checkbox
                      checked={region.deliveryDays.includes(day)}
                      onCheckedChange={() =>
                        handleDayChangeRequest(region, day)
                      }
                    />
                  </td>
                ))}
                <td className="border p-2 text-center">
                  {!region.isNew && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the region.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteRegion(region.id!)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button className="mt-4" onClick={handleSave}>
        Save Changes
      </Button>
      {/* Confirmation Dialog for Day Change */}
      <AlertDialog
        open={!!selectedRegion}
        onOpenChange={() => setSelectedRegion(null)}
      >
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Day Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the delivery days for this region?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDayChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageRegions;
