import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const featuredProducts = [
  {
    id: 1,
    title: "Manda Sütü",
    desc: "1 kg çiğ manda sütü",
    price: "100",
    img: "/cat1.png",
  },
  {
    id: 2,
    title: "Domates Sosu",
    desc: "1 kg taze domates sosu",
    price: "80",
    img: "/cat2.png",
  },
  {
    id: 3,
    title: "Taze Yumurta",
    desc: "1 kg organik yumurta",
    price: "70",
    img: "/cat3.png",
  },
  {
    id: 4,
    title: "Bal",
    desc: "1 kg doğal bal",
    price: "120",
    img: "/cat4.png",
  },
  {
    id: 5,
    title: "Beyaz Peynir",
    desc: "1 kg çiğ beyaz peynir",
    price: "90",
    img: "/cat1.png",
  },
  {
    id: 6,
    title: "Taze Yoğurt",
    desc: "1 kg ev yapımı yoğurt",
    price: "75",
    img: "/cat2.png",
  },
];

const Featured = () => {
  return (
    <div className="w-full text-orange-500 my-36">
      <h1 className="glowing-text text-center text-5xl md:text-6xl lg:text-7xl text-white font-bold pb-11">
        Ürünler
      </h1>
      <div className="w-full flex justify-center items-center py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
          {featuredProducts.map((item) => (
            <div
              key={item.id}
              className="w-full h-full flex flex-col items-center justify-between p-2 md:p-4 border-2 border-orange-500 rounded-lg shadow-lg bg-dark-100"
            >
              <div className="relative w-full h-40 md:h-48 lg:h-64">
                <Image
                  src={item.img}
                  alt={item.title}
                  layout="fill"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center mt-2 md:mt-4">
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold">
                  {item.title}
                </h2>
                <p className="my-1 md:my-2 text-xs md:text-lg text-white pb-4">
                  {item.desc}
                </p>
                <div className="flex text-yellow-500 mb-2 bg-white rounded-md px-2 py-1">
                  {Array(5)
                    .fill("")
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                </div>
                <span className="text-lg md:text-xl lg:text-2xl text-white font-bold">
                  {item.price} TL
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center pt-16 md:mt-8">
        <Link href="/menu">
          <button className="bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600 transition duration-300">
            Daha Fazlasını Göster
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Featured;
