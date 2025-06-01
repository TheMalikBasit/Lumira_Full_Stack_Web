import { socials } from "../constants";
import DefaultStyler from "./DefaultStyler";
import Image from "next/image";
const FooterOne = ({ hidden, padLinesHide, crosses }) => {
  return (
    <DefaultStyler
      crosses={crosses}
      padLinesHide={padLinesHide}
      className={`!px-0 !py-10 ${hidden ? "hidden" : "relative"}`}
    >
      <div className="container flex justify-center sm:justify-between items-center gap-10 max-sm:flex-col">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. All rights reserved
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
    </DefaultStyler>
  );
};

export default FooterOne;
