"use client";

import { useLoadingStore } from "@/utils/store";
import LoadingSpinner from "./loadingSpinner";

const LoadingHandler = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return isLoading ? <LoadingSpinner /> : null;
};

export default LoadingHandler;
