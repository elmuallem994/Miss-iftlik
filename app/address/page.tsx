"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@/app/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Pencil, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";

// Define the Region type
type Region = {
  id: number;
  name: string;
  neighborhoods: string[] | null;
};

// Zod schema for form validation
const addressSchema = z.object({
  il: z.string().min(1, { message: "Il (City) is required" }),
  adres: z.string().min(1, { message: "Adres (Full Address) is required" }),
  neighborhoods: z.string().min(1, { message: "Region is required" }),
  regionId: z.number().min(1, { message: "Region is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]); // Array of regions
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [address, setAddress] = useState<AddressFormValues | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]); // Array of neighborhoods

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      il: address?.il || "",
      neighborhoods: address?.neighborhoods,
      adres: address?.adres || "",
      regionId: address?.regionId || undefined,
    },
  });

  // Fetch regions and address when the component mounts
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/regions");
        const data: Region[] = await res.json();

        // Filter unique regions based on name
        const uniqueRegions = Array.from(
          new Set(data.map((region) => region.name))
        ).map((name) => data.find((region) => region.name === name));

        setRegions(uniqueRegions as Region[]);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    const fetchAddress = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/address");
        if (res.ok) {
          const data: AddressFormValues[] = await res.json();
          if (data.length > 0) {
            setAddress(data[0]);
            form.reset(data[0]);
          } else {
            setIsEditModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchRegions();
    fetchAddress();
  }, [form]);

  // Function to fetch neighborhoods when selecting a region
  const fetchNeighborhoods = async (regionId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/regions/${regionId}`);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched Neighborhoods: ", data.neighborhoods);

        // Ensure neighborhoods is set to an array, even if it's empty
        setNeighborhoods(
          Array.isArray(data.neighborhoods) ? data.neighborhoods : []
        );
      }
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
      // Set neighborhoods to an empty array on error
      setNeighborhoods([]);
    }
  };

  // Handle form submission for creating a new address
  const createAddress = async (data: AddressFormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setAddress(data);
          toast.success("تم إنشاء العنوان بنجاح");
          setIsEditModalOpen(false);
          router.refresh();
        } else {
          toast.error("حدث خطأ أثناء إنشاء العنوان");
        }
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء العملية");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form submission for updating the address
  const updateAddress = async (data: AddressFormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/address", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          setAddress(data);
          toast.success("تم تحديث العنوان بنجاح");
          setIsEditModalOpen(false);
        } else {
          toast.error("حدث خطأ أثناء تحديث العنوان");
        }
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء العملية");
      } finally {
        setLoading(false);
      }
    }
  };

  // Determine the correct submit handler based on whether an address exists
  const onSubmit = (data: AddressFormValues) => {
    if (address) {
      updateAddress(data);
    } else {
      createAddress(data);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center gap-3 pt-7">
        <h2 className=" text-4xl text-orange-600 font-bold tracking-tight ">
          Teslimat adresi
        </h2>
        <p className="text-base text-muted-foreground text-orange-500">
          Burada teslimat adresinizi ekleyebilir ve değiştirebilirsiniz
        </p>
      </div>
      <Separator />
      {address && (
        <div className="flex justify-center items-center pt-20">
          <div className="border p-6 rounded-xl shadow-xl shadow-gray-200 bg-orange-50 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-orange-500 mr-2" />
                <h3 className="text-xl font-bold text-gray-700">
                  معلومات العنوان
                </h3>
              </div>
              <Button
                className="cursor-pointer rounded-full bg-orange-500 hover:bg-orange-600 p-3"
                onClick={() => setIsEditModalOpen(true)}
              >
                <span className="text-white font-medium pr-3 ">düzenle</span>
                <Pencil className="w-5 h-5 text-white" />
              </Button>
            </div>
            <div className="space-y-2 text-gray-700 p-2">
              <p>
                <strong className="text-gray-800 p-2 ">Şehir:</strong>{" "}
                {address.il}
              </p>

              <p>
                <strong className="text-gray-800 p-2">Mahalle:</strong>{" "}
                {address.neighborhoods}
              </p>
              <p>
                <strong className="text-gray-800 p-2">Tam Adres:</strong>{" "}
                {address.adres}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white shadow-xl rounded-2xl p-8 max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {address ? "تعديل العنوان" : "إضافة عنوان جديد"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {address
                ? "قم بتعديل تفاصيل العنوان الحالي واحفظ التعديلات."
                : "أدخل تفاصيل العنوان الجديد واحفظه."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* حقول الفورم */}
              <FormField
                control={form.control}
                name="il"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Il (City)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="City"
                        className="border-gray-300 rounded-lg focus:border-orange-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region (Select your region)</FormLabel>
                    <FormControl>
                      <select
                        disabled={loading}
                        {...field}
                        className="p-2 border rounded"
                        onChange={(e) => {
                          const selectedRegionId = Number(e.target.value); // Convert value to number
                          field.onChange(selectedRegionId); // Update form state with number
                          fetchNeighborhoods(selectedRegionId.toString()); // Fetch neighborhoods with a string representation
                        }}
                      >
                        <option value="">Select a region</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhoods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>neighborhoods (Neighborhood)</FormLabel>
                    <FormControl>
                      <select
                        disabled={loading}
                        {...field}
                        className="p-2 border rounded"
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="">Select a neighborhood</option>
                        {Array.isArray(neighborhoods) &&
                        neighborhoods.length > 0 ? (
                          neighborhoods.map((neighborhood) => (
                            <option key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </option>
                          ))
                        ) : (
                          <option value="">All neighborhoods available</option>
                        )}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres (Full Address)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Full Address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2"
                type="submit"
              >
                {address ? "حفظ التعديلات" : "إرسال"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressPage;
