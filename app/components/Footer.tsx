"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();

  // التحقق مما إذا كانت الصفحة الحالية هي الصفحة الرئيسية
  if (pathname !== "/") {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-auto">
      {/* خط علوي */}
      <div className="w-[85%] h-[1px] bg-gray-500 mx-auto mb-10" />

      <div className="max-w-7xl mx-auto  flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left space-y-8 md:space-y-0 md:space-x-10">
        {/* شعار المتجر */}
        <div className="md:flex-1">
          <Link
            href="/"
            className="text-2xl font-bold text-orange-400 hover:text-orange-500 transition duration-300"
          >
            Miss çiftlik
          </Link>
        </div>

        {/* روابط الأقسام */}
        <div className="flex items-center justify-center">
          <ul className="flex items-center space-x-4 md:space-x-7 text-sm md:text-base">
            <li>
              <Link
                href="/about"
                className="hover:text-orange-500 transition duration-300"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="hover:text-orange-500 transition duration-300"
              >
                Ekibimiz
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-orange-500 transition duration-300"
              >
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        {/* أيقونات وسائل التواصل الاجتماعي */}
        <div className="md:flex-1 flex justify-center md:justify-end space-x-4">
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition duration-300"
          >
            <FaFacebookF size={24} />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition duration-300"
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition duration-300"
          >
            <FaTwitter size={24} />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-orange-500 transition duration-300"
          >
            <FaLinkedinIn size={24} />
          </Link>
        </div>
      </div>

      {/* نص الحقوق */}
      <div className="text-center text-xs text-gray-500   pt-4">
        © 2024 Miss çiftlik. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
