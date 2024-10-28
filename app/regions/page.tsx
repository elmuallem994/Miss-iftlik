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
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
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
          throw new Error("Failed to fetch entries");
        }

        const data = await response.json();
        setEntries(data);
      } catch (error) {
        toast.error("Failed to load entries");
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
        toast.error(
          "Region with the same name and neighborhood already exists."
        );
        return;
      }

      if (!response.ok) {
        toast.error("Failed to save entry.");
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
      toast.error("Please fill all fields and select delivery days.");
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
        toast.error("Failed to update region.");
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
      toast.success("Region updated successfully.");
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error("Error updating region.");
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
        toast.error("Failed to delete region.");
        return;
      }

      // تحديث الإدخالات بعد الحذف
      setEntries(entries.filter((entry) => entry.id !== regionId));
      toast.success("Region deleted successfully.");
    } catch (error) {
      console.error("Error deleting region:", error);
      toast.error("Error deleting region.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Manage Locations</h1>
      <Separator className="my-4" />

      {/* Region Input */}
      <div className="flex flex-col gap-4 mb-4">
        <Input
          placeholder="Enter Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
      </div>

      {/* Neighborhood Input */}
      <div className="flex flex-col gap-4 mb-4">
        <Input
          placeholder="Enter Neighborhood "
          value={neighborhoods || ""}
          onChange={(e) => setNeighborhoods(e.target.value || null)}
        />
      </div>

      {/* Days of the Week Selection */}
      <div className="flex items-center gap-4 mb-4">
        {allDays.map((day) => (
          <div key={day} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={(e) => handleDayChange(day, e.target.checked)}
            />
            <label>{day}</label>
          </div>
        ))}
      </div>

      {/* Delivery Time Selection */}
      <div className="flex flex-col gap-4 mb-4">
        <label className="text-lg font-semibold">Delivery Time:</label>
        <div className="flex gap-4">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="text-lg p-2 border border-gray-300 rounded-md"
          />
          <span className="text-lg font-semibold">to</span>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="text-lg p-2 border border-gray-300 rounded-md"
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
      >
        {editingRegionId ? "Update Entry" : "Add Entry"}
      </Button>

      {/* عرض الإدخالات في جدول */}
      <table className="min-w-full border-collapse mt-4">
        <thead>
          <tr>
            <th className="border p-2">Region</th>
            <th className="border p-2">Neighborhood</th>
            <th className="border p-2">Delivery Days</th>
            <th className="border p-2">Start Time</th>
            <th className="border p-2">End Time</th>
            <th className="border p-2">Actions</th>
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
                {/* أيقونة التعديل */}
                <button onClick={() => handleEdit(entry)}>
                  <FaEdit className="text-blue-600" />
                </button>
                {/* أيقونة الحذف */}
                <button onClick={() => handleDelete(entry.id)}>
                  <FaTrash className="text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageLocations;
