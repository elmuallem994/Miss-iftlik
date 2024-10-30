import Image from "next/image";
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
    <div className="w-full text-orange-500 py-8">
      <h1 className="glowing-text text-center text-8xl text-white font-extralight mb-8">
        Ürünler
      </h1>
      <div className="w-full flex justify-center items-center py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-[70%] lg:w-[60%]">
          {featuredProducts.map((item) => (
            <div
              key={item.id}
              className="w-full h-full flex flex-col items-center justify-between p-4 border-2 border-orange-500 rounded-lg shadow-lg"
            >
              <div className="relative w-full h-64">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-contain aspect-square"
                />
              </div>
              <div className="flex flex-col items-center justify-center text-center mt-4">
                <h2 className="text-4xl font-bold">{item.title}</h2>
                <p className="my-4 text-lg text-white">{item.desc}</p>
                <div className="flex text-yellow-500 mb-4 bg-white rounded-md px-2 py-1">
                  {Array(5)
                    .fill("")
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}
                </div>
                <span className="text-2xl text-white font-bold">
                  {item.price} TL
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8">
        <button className="bg-orange-500 text-white py-2 px-4 rounded-md">
          Daha Fazlasını Göster
        </button>
      </div>
    </div>
  );
};

export default Featured;
