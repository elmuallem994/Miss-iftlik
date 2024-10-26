import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[100] ">
      <ClipLoader color="#f97316" size={65} />
    </div>
  );
};

export default LoadingSpinner;
