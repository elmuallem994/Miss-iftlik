"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { ProductType } from "@/app/types/types";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/products?search=${query}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data); // تحديث نتائج البحث
      } else {
        console.error("Error fetching search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="px-4 py-2 rounded-l-full border-none focus:outline-none"
        placeholder="Ürün arayın..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSearch}
        className="bg-orange-500 text-white rounded-r-full px-4 py-2"
      >
        <FaSearch />
      </button>

      {/* عرض نتائج البحث */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-md p-4">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push(`/menu/${product.catSlug}`)}
            >
              {product.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
