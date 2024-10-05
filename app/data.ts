type Product = {
  id: number;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  options?: { title: string; additionalPrice: number }[];
};

type Products = Product[];

export const featuredProducts: Products = [
  {
    id: 1,
    title: "Tam Yagli",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p6.png",
    price: 24.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 2,
    title: "Tam peyniri",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p8.png",
    price: 29.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 3,
    title: "Yumurta",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p3.png",
    price: 24.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 4,
    title: "Taze Sut",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p8.png",
    price: 26.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
];

export const pizzas: Products = [
  {
    id: 1,
    title: "Sut",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p8.png",
    price: 24.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 2,
    title: "peynir",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p6.png",
    price: 32.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 3,
    title: "Yumurta",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p3.png",
    price: 26.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 4,
    title: "Taze Sut",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p6.png",
    price: 28.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 5,
    title: "Tam yali peynir",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p8.png",
    price: 24.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
  {
    id: 6,
    title: "yumurta",
    desc: "Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
    img: "/temporary/p6.png",
    price: 22.9,
    options: [
      {
        title: "Small",
        additionalPrice: 0,
      },
      {
        title: "Medium",
        additionalPrice: 4,
      },
      {
        title: "Large",
        additionalPrice: 6,
      },
    ],
  },
];

export const singleProduct: Product = {
  id: 1,
  title: "Taze Sut",
  desc: " Ürünün stok, fiyat ve kampanya bilgisi, teslimatı gerçekleştirecek mağazanın stok, fiyat ve kampanya bilgilerine göre belirlenmektedir.",
  img: "/temporary/p8.png",
  price: 24.9,
  options: [
    {
      title: "1 litre",
      additionalPrice: 0,
    },
    {
      title: "2 litre",
      additionalPrice: 4,
    },
    {
      title: "5 litre",
      additionalPrice: 6,
    },
  ],
};

type Menu = {
  id: number;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

export const menu: Menu = [
  {
    id: 1,
    slug: "yumurtalar",
    title: "Taze Yumurtalar", // العنوان باللغة التركية
    desc: "En taze yumurtalarımızla lezzetli kahvaltı sofraları kurun.", // وصف البيض
    img: "/temporary/m1.png",
    color: "white",
  },
  {
    id: 2,
    slug: "süt",
    title: "Taze   Süt", // العنوان باللغة التركية للحليب
    desc: "Her gün kapınıza gelen taze çiftlik sütü kapınıza gelen taze çiftlik sütü.", // وصف الحليب
    img: "/temporary/m2.png",
    color: "white",
  },
  {
    id: 3,
    slug: "peynirler",
    title: "Lezzetli Peynirler", // العنوان باللغة التركية للجبنة
    desc: "En kaliteli tam yağlı peynirlerimizle sofralarınıza lezzet katın.", // وصف الجبنة
    img: "/temporary/m3.png",
    color: "white",
  },
];
