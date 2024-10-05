import Link from "next/link";
import Menu from "./Menu";
import CartIcon from "./CartIcon";
import Image from "next/image";

const Navbar = () => {
  const user = false;
  return (
    <div className="h-12 text-orange-500 p-4 flex items-center justify-between border-b-2 border-b-orange-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/** LIFT LINKS */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Ana sayfa</Link>
        <Link href="/menu">Menü</Link>
        <Link href="/">İletişim</Link>
      </div>

      {/** LOGO */}
      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">Miss çiftlik</Link>
      </div>
      {/** MOBILE MENU */}
      <div className="md:hidden">
        <Menu />
      </div>
      {/** RIGHT LINKS */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <div className="md:absolute top-3 right-2 lg:static flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>123 456 78</span>
        </div>
        {!user ? (
          <Link href="/login">Giriş</Link>
        ) : (
          <Link href="/orders">Siparişlerim</Link>
        )}

        <CartIcon />
      </div>
    </div>
  );
};
export default Navbar;
