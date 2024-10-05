import Link from "next/link";

const Footer = () => {
  return (
    <div className="h-12 md:h-24 p-8 lg:p-14 bg-orange-50  text-orange-500 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl">
        Miss çiftlik
      </Link>
      <p>ALL RIGHTS RESERVED.</p>
    </div>
  );
};
export default Footer;
