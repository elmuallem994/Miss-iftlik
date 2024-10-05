import Image from "next/image";

const CartPage = () => {
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-orange-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* SINGLE ITEM */}
        <div className="flex items-center justify-between mb-4">
          <Image src="/temporary/p3.png" alt="" width={100} height={100} />
          <div className="">
            <h1 className="uppercase text-xl font-bold">yumurta</h1>
            <span>Large</span>
          </div>
          <h2 className="font-bold">79.90 TL</h2>
          <span className="cursor-pointer">X</span>
        </div>
        {/* SINGLE ITEM */}
        <div className="flex items-center justify-between mb-4">
          <Image src="/temporary/p6.png" alt="" width={100} height={100} />
          <div className="">
            <h1 className="uppercase text-xl font-bold">peynir</h1>
            <span>Large</span>
          </div>
          <h2 className="font-bold">79.90 TL</h2>
          <span className="cursor-pointer">X</span>
        </div>
        {/* SINGLE ITEM */}
        <div className="flex items-center justify-between mb-4">
          <Image src="/temporary/p8.png" alt="" width={100} height={100} />
          <div className="">
            <h1 className="uppercase text-xl font-bold">sut</h1>
            <span>5 litre</span>
          </div>
          <h2 className="font-bold">79.90 TL</h2>
          <span className="cursor-pointer">X</span>
        </div>
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-orange-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Toplam (3 urun)</span>
          <span className="">81.70 TL</span>
        </div>

        <div className="flex justify-between">
          <span className="">Teslimat Ucreti</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOPLAM (KDV DAHİL)</span>
          <span className="font-bold">81.70 TL</span>
        </div>
        <button className="bg-orange-500 text-white p-3 rounded-md w-1/2 self-end">
          ONAYLA
        </button>
      </div>
    </div>
  );
};

export default CartPage;
