"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";

// Define the Region type
type Region = {
  id: number;
  name: string;
};

// Zod schema for form validation
const addressSchema = z.object({
  il: z.string().min(1, { message: "Il (City) is required" }),
  ilce: z.string().min(1, { message: "Ilce (District) is required" }),
  mahalle: z.string().min(1, { message: "Mahalle (Neighborhood) is required" }),
  adres: z.string().min(1, { message: "Adres (Full Address) is required" }),
  regionId: z.number().min(1, { message: "Region is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]); // Array of regions
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Fetch regions when the component mounts
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/regions"); // Fetch list of regions from the API
        const data: Region[] = await res.json(); // Ensure the data is of the correct type
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      il: "",
      ilce: "",
      mahalle: "",
      adres: "",
      regionId: undefined, // Set to undefined instead of an empty string
    },
  });

  // Handle form submission
  const onSubmit = async (data: AddressFormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            regionId: data.regionId, // Send the selected region ID
          }),
        });

        if (res.ok) {
          toast.success("تم حفظ العنوان بنجاح");
          router.push("/");
        } else {
          toast.error("حدث خطأ أثناء حفظ العنوان");
        }
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء العملية");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Heading
        title="إضافة عنوان جديد"
        description="يرجى إدخال تفاصيل العنوان"
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* City field (Il) */}
          <FormField
            control={form.control}
            name="il"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Il (City)</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Region field */}
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
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convert the value to a number
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

          {/* District field (Ilce) */}
          <FormField
            control={form.control}
            name="ilce"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ilce (District)</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="District" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Neighborhood field (Mahalle) */}
          <FormField
            control={form.control}
            name="mahalle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mahalle (Neighborhood)</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Neighborhood"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Full Address field (Adres) */}
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

          <Button disabled={loading} className="ml-auto" type="submit">
            حفظ العنوان
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddressForm;
