import DefaultStyler from "./DefaultStyler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const FooterTwo = ({ hidden, padLinesHide, crosses, white }) => {
  return (
    <DefaultStyler
      crosses={crosses}
      padLinesHide={padLinesHide}
      className={`!px-0 !py-10 ${hidden ? "hidden" : "relative"}`}
    >
      <h1
        className={`${
          white ? "font-bold text-orange-500 text-lg" : "text-n-4"
        } text-center mb-6 font-code caption lg:block`}
      >
        DEVELOPER CONTACTS
      </h1>
      <div className="container flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-6 text-white text-sm font-semibold">
        <a
          className="flex items-center space-x-3 hover:underline"
          href="https://github.com/TheMalikBasit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faGithub}
            className={`${white ? "text-black" : ""}`}
            size="lg"
          />
          <span
            className={`${
              white ? "font-bold text-black text-lg" : "text-n-4"
            } font-code caption lg:block`}
          >
            github.com/
          </span>
        </a>

        <a
          className="flex items-center space-x-3 hover:underline"
          href="https://www.linkedin.com/in/malik-abdul-basit-24b634267/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faLinkedin}
            className={`${white ? "text-black" : ""}`}
            size="lg"
          />
          <span
            className={`${
              white ? "font-bold text-black text-lg" : "text-n-4"
            } font-code caption lg:block`}
          >
            linkedin.com/in/
          </span>
        </a>
      </div>
    </DefaultStyler>
  );
};

export default FooterTwo;
