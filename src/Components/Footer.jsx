import { socials } from "../constants";
import DefaultStyler from "./DefaultStyler";
import Image from "next/image";
const FooterOne = ({ hidden, padLinesHide, crosses, white }) => {
  return (
    <div className="mt-20 container flex justify-center sm:justify-between items-center gap-10 max-sm:flex-col pt-10 pb-10">
      <p
        className={`${
          white ? "font-bold text-black text-lg" : "text-n-4"
        } font-code caption lg:block`}
      >
        © {new Date().getFullYear()}. Riwayat All rights reserved
      </p>
      <ul className="flex flex-wrap gap-5">
        {socials.map((item) => (
          <a
            className="flex items-center justify-center w-10 h-10 rounded-full bg-n-7 transition-colors hover:bg-n-6"
            key={item.id}
            href={item.url}
            target="_blank"
          >
            <Image src={item.iconUrl} width={15} height={15} alt="" />
          </a>
        ))}
      </ul>
    </div>
  );
};

export default FooterOne;
