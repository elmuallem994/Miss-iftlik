// app/address/page.tsx

"use client";

import * as z from "zod";
import { useState } from "react";
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

// Zod schema
const addressSchema = z.object({
  il: z.string().min(1, { message: "Il (City) is required" }),
  ilce: z.string().min(1, { message: "Ilce (District) is required" }),
  mahalle: z.string().min(1, { message: "Mahalle (Neighborhood) is required" }),
  adres: z.string().min(1, { message: "Adres (Full Address) is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      il: "",
      ilce: "",
      mahalle: "",
      adres: "",
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
    } else {
      try {
        setLoading(true);
        // إرسال بيانات العنوان إلى الخادم لحفظها
        const res = await fetch("http://localhost:3000/api/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data), // البيانات المرسلة
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
          {/* حقل المدينة (Il) */}
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

          {/* حقل المقاطعة (Ilce) */}
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

          {/* حقل الحي (Mahalle) */}
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

          {/* حقل العنوان الكامل (Adres) */}
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
