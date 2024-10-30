import { Clock, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Notification = () => {
  return (
    <div className="h-auto bg-orange-400 text-white px-4 py-2 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-14 text-xs md:text-base cursor-pointer">
      <div className="flex items-center gap-1 md:gap-2 flex-row">
        <Clock className="w-3 h-3 md:w-4 md:h-4" />
        <span className="pr-10 md:pr-0">08:00am - 17:30pm</span>
        <span className="hidden md:inline h-4 border-l border-white mx-2" />
        <FaWhatsapp className="w-3 h-3 md:w-4 md:h-4" />
        <span>+90 0534 822 88 65</span>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-row">
        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
        <span>Karlıtepe Mah. Gaziosmanpaşa, Istanbul</span>
      </div>

      <div className="hidden md:flex items-center gap-1 md:gap-2">
        <span>Dil: Türkçe</span>
      </div>
    </div>
  );
};

export default Notification;
