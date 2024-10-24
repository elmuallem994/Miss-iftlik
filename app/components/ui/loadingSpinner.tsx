import Lottie from "lottie-react";
import milkAnimation from "@/public/milk-bottle.json"; // المسار إلى ملف JSON الذي قمت بتحميله

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[100%]">
      <Lottie
        animationData={milkAnimation}
        loop={true}
        className="w-52 h-52" // حجم صغير للأنيميشن
      />
    </div>
  );
};

export default LoadingSpinner;
