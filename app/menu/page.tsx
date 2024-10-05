import Link from "next/link";
import { menu } from "../data";

const MenuPage = () => {
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center ">
      {menu.map((category) => (
        <Link
          href={`/menu/${category.slug}`}
          key={category.id}
          className="w-full h-1/3 bg-cover p-8 md:h-1/2"
          style={{ backgroundImage: `url(${category.img})` }}
        >
          {/* إضافة الخلفية الرمادية الشفافة */}
          <div className="relative flex flex-col justify-between text-orange-50 w-[75%] md:w-[80%] xl:w-[60%] 2xl:w-[55%] p-3 md:p-6 bg-orange-600 bg-opacity-40 rounded-md h-full">
            {/* تعديل خلف النص */}
            <h1 className="uppercase font-bold text-lg lg:text-3xl">
              {category.title}
            </h1>
            <p className="text-sm my-4 flex-grow">{category.desc}</p>
            <button className="self-start bg-orange-600 text-white py-1 px-2 md:py-2 md:px-4 rounded-md">
              Keşfet
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPage;
