"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

const Slider = () => {
  return (
    <div className="h-screen w-full relative my-swiper-container z-0">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        effect="fade"
        speed={800}
        className="w-full h-full"
      >
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide1.JPG"
              alt="Slide 1"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide2.JPG"
              alt="Slide 2"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide3.JPG"
              alt="Slide 3"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src="/slide4.JPG"
              alt="Slide 4"
              fill
              className="object-cover zoom-in-effect"
            />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* صورة أمواج الحليب */}
      <div className="absolute bottom-[-2px] md:bottom-[-10px] left-0 w-full  z-10">
        <Image
          src="/mog.png" // ضع رابط صورة الأمواج هنا
          alt="Milk Waves"
          width={1920}
          height={200}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Slider;
