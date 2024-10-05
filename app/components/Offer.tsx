import React from "react";

const Offer = () => {
  return (
    <div className="bg-black h-screen flex flex-col md:flex-row md:justify-between md:bg-[url('/offerBg.png')] md:h-[70vh]">
      {/* TEXT CONTAINER */}
      <div className="flex-1 flex flex-col justify-center items-center text-center gap-8 p-6">
        <h1 className="text-white text-5xl font-bold xl:text-6xl">
          fiyat kampanya & teslimatı gerçekleştirecek
        </h1>
        <p className="text-white xl:text-xl">
          Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek
          mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.
        </p>

        <button className="bg-red-500 text-white rounded-md py-3 px-6">
          Şimdi Sipariş Ver
        </button>
      </div>
      {/* IMAGE CONTAINER */}
    </div>
  );
};

export default Offer;
