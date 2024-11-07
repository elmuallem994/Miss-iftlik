import { CheckCircle, Truck, Home, Package } from "lucide-react"; // استيراد الأيقونات المطلوبة

interface StatusProps {
  status: string;
}

const OrderStatus: React.FC<StatusProps> = ({ status }) => {
  const statusList = [
    { name: "Alındı", icon: <Package className="w-4 h-4 md:w-5 md:h-5" /> },
    { name: "hazırlanıyor", icon: <Home className="w-4 h-4 md:w-5 md:h-5" /> },
    { name: "Yolda", icon: <Truck className="w-4 h-4 md:w-5 md:h-5" /> },
    {
      name: "teslim edildi",
      icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />,
    },
  ];

  // الحصول على الفهرس بناءً على حالة الطلب
  const statusIndex = statusList.findIndex((item) => item.name === status);

  return (
    <div className="flex justify-between items-center w-full relative">
      {statusList.map((item, index) => (
        <div key={index} className="relative flex flex-col items-center">
          {/* إضافة الخط الواصل */}
          {index < statusList.length - 1 && (
            <div
              className={`absolute flex top-[30%] left-6 w-14 md:w-20 h-1 ${
                index < statusIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          )}
          {/* عرض الأيقونة بناءً على الحالة */}
          <div
            className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-gray-100 z-50 ${
              index <= statusIndex ? "bg-green-500" : "bg-gray-300"
            } ${index === statusIndex ? "pulsing-icon " : ""}`}
          >
            {item.icon}
          </div>
          <p
            className={`text-xs md:text-sm text-center mt-1 ${
              index <= statusIndex
                ? "text-green-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderStatus;
