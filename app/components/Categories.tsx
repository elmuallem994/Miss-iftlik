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
    <div className="min-h-screen container mx-auto flex flex-col justify-center items-center">
      <div className="text-center pt-14 mt-4 mb-6">
        <h1 className="glowing-text  text-8xl text-white font-extralight">
          Günlük Taze
        </h1>
        <p className="mt-6 text-lg text-gray-100">
          Türkiye bölgesinin benzersiz topraklarından gelen çiftlikten
          tazelenmiş، sizlere en doğal tadıyla ve doğallığı ile sunmaktayız.
          Hızlı، güvenilir ve doğal ürünlerimizle beyazdan yeşile...
        </p>
      </div>
      <Carousel opts={{ align: "center" }} className="w-full max-w-4xl">
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className=" basis-[63%] md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="bg-orange-100 flex aspect-square items-center justify-center p-6">
                    <Image
                      src={category.image}
                      alt={category.title}
                      width={400} // Adjusted width
                      height={300} // Adjusted height
                      className=" object-contain "
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Categories;
