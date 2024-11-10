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
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useLoadingStore } from "@/utils/store";

// Define the Region type
type Region = {
  id: number;
  name: string;
  neighborhoods: string;
};

// Zod schema for form validation
const addressSchema = z.object({
  il: z.string().min(1, { message: "Il (City) is required" }),
  adres: z.string().min(1, { message: "Adres (Full Address) is required" }),
  regionId: z.number().min(1, { message: "Region is required" }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const AddressPage: React.FC = () => {
  const { setLoading, isLoading } = useLoadingStore();
  const [regions, setRegions] = useState<Region[]>([]); // Array of regions
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [address, setAddress] = useState<AddressFormValues | null>(null);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      il: address?.il || "Istanbul", // تأكد من تعيين القيمة الافتراضية "Istanbul"
      adres: address?.adres || "",
      regionId: address?.regionId || undefined,
    },
  });

  // Fetch regions and address when the component mounts
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/regions");
        const data: Region[] = await res.json();

        // لا نقوم بفلترة أو دمج الأسماء، نعرض كل شيء كما هو من قاعدة البيانات
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    const fetchAddress = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchRegions();
    fetchAddress();
  }, [form, setLoading]);

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
    <div className="p-4 main-content ">
      <div className="flex flex-col justify-center items-center gap-3 ">
        <h2 className=" text-4xl text-orange-500 font-bold tracking-tight ">
          Teslimat adresi
        </h2>
        <p className="text-base text-muted-foreground text-orange-400">
          Burada teslimat adresinizi ekleyebilir ve değiştirebilirsiniz
        </p>
      </div>

      {address && (
        <div className="flex justify-center items-center pt-10">
          <div className=" p-8 rounded-3xl shadow-lg bg-orange-50 max-w-3xl w-full mx-auto">
            {/* Başlık */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 text-orange-500 mr-2 " />
                <h3 className="text-3xl font-semibold text-gray-500">
                  Adresim
                </h3>
              </div>
              <div className="flex justify-end w-full ">
                <Button
                  className="px-4 py-2  bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition-colors"
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={isLoading}
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Düzenle</span>
                </Button>
              </div>
            </div>

            {/* Adres Detayları */}
            <div className="space-y-4 text-gray-700">
              <div className="flex flex-col items-start ">
                <strong className="text-orange-400 pb-1">Şehir:</strong>
                <p>{address.il}</p>
              </div>

              <div className="flex flex-col items-start">
                <strong className="text-orange-400 pb-1">Mahalle:</strong>
                <p>
                  {regions.find((region) => region.id === address.regionId)
                    ? `${
                        regions.find((region) => region.id === address.regionId)
                          ?.name
                      } - ${
                        regions.find((region) => region.id === address.regionId)
                          ?.neighborhoods
                      }`
                    : "Mevcut değil"}
                </p>
              </div>

              <div className="flex flex-col items-start">
                <strong className="text-orange-400 pb-1 ">Tam Adres:</strong>
                <p className="max-w-sm w-full ">{address.adres}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Düzenleme Dialogu */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white shadow-xl rounded-2xl p-8 max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {address ? "Adresi Düzenle" : "Yeni Adres Ekle"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {address
                ? "Mevcut adres bilgilerini düzenleyin ve değişiklikleri kaydedin."
                : "Yeni adres bilgilerini girin ve kaydedin."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* Form Alanları */}
              <FormField
                control={form.control}
                name="il"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">Şehir</FormLabel>
                    <FormControl>
                      <Input
                        {...field} // alanı formda tutmak için spread operator
                        readOnly // düzenlemeyi engelle
                        autoFocus={false} // sayfa veya modal açıldığında otomatik odaklanmayı engelle
                        className=" bg-gray-100 text-gray-500"
                        style={{ pointerEvents: "none" }} // fare ile tıklamayı devre dışı bırak
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
                    <FormLabel className="text-orange-400">
                      ilçe - mahalle
                    </FormLabel>
                    <FormControl>
                      <select
                        disabled={isLoading}
                        {...field}
                        className="p-2 border rounded w-full"
                        onChange={(e) => {
                          const selectedRegionId = Number(e.target.value); // değeri sayıya çevir
                          field.onChange(selectedRegionId); // formdaki bölge kimliğini güncelle
                        }}
                      >
                        <option value="">Bölge ve mahalleyi seçin</option>
                        {regions.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name} - {region.neighborhoods}
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
                name="adres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-orange-400">Tam Adres</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Tam Adres"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-4 mt-4">
                <Button
                  disabled={isLoading}
                  className="w-full text-md bg-orange-600 hover:bg-orange-700 text-white rounded-lg py-2"
                  type="submit"
                >
                  {address ? "Değişiklikleri Kaydet" : "Gönder"}
                </Button>

                <Separator />

                {/* رسالة بجانب الزر */}
                <div className="flex flex-col items-center">
                  <p className="text-sm text-red-600 text-center mt-2">
                    Eğer bölgeniz listede yoksa, lütfen WhatsApp üzerinden{" "}
                    <br /> bizimle iletişime geçin.
                  </p>

                  {/* زر واتساب */}
                  <Link
                    href="https://wa.me/905348228865"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4 mr-2" />
                    WhatsApp ile iletişime geç
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressPage;
