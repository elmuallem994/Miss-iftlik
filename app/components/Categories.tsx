"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Categories = () => {
  const categories = [
    { id: 1, title: "Eggs", image: "/cat1.png" },
    { id: 2, title: "Milk", image: "/cat2.png" },
    { id: 3, title: "Olive Oil", image: "/cat3.png" },
    { id: 4, title: "Olive ", image: "/cat4.png" },
  ];

  return (
    <div className="min-h-screen container mx-auto flex flex-col justify-center items-center px-4">
      <div className="text-center pt-14 mt-1 pb-16">
        <h1 className="glowing-text text-4xl md:text-5xl lg:text-6xl text-white font-bold">
          Günlük Taze
        </h1>
        <p className="mt-10 text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto">
          Türkiye nin bereketli topraklarından doğanın sunduğu en taze ve doğal
          ürünleri sizler için özenle topladık. Çiftlikten sofranıza ulaşan bu
          ürünlerle, lezzet ve sağlık dolu bir yaşam sunuyoruz. Doğal
          lezzetlerin tadını çıkarın ve sağlıklı bir yaşam için güvenle tercih
          edin
        </p>
      </div>

      <Carousel
        opts={{ align: "center" }}
        className="w-full max-w-4xl space-y-4"
      >
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="flex basis-[90%] sm:basis-[45%] md:basis-[30%] px-2"
            >
              <div className="transition-transform duration-300 transform hover:scale-105">
                <Card className="rounded-lg shadow-lg">
                  <CardContent className="bg-gradient-to-r from-orange-50 to-orange-100 flex aspect-square items-center justify-center p-4 rounded-lg">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={400}
                      height={300}
                      className="object-contain"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="text-gray-600 hover:text-gray-800" />
        <CarouselNext className="text-gray-600 hover:text-gray-800" />
      </Carousel>
    </div>
  );
};

export default Categories;
