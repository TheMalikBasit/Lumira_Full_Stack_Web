import DefaultStyler from "./DefaultStyler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const FooterTwo = ({ hidden }) => {
  return (
    <DefaultStyler
      crosses
      className={`!px-0 !py-10 ${hidden ? "hidden" : "relative"}`}
    >
      <div className="container flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-6 text-white text-sm font-semibold">
        <a
          className="flex items-center space-x-3 hover:underline"
          href="https://github.com/TheMalikBasit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="lg" />
          <span>github.com/TheMalikBasit</span>
        </a>

        <a
          className="flex items-center space-x-3 hover:underline"
          href="https://www.linkedin.com/in/malik-abdul-basit-24b634267/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faLinkedin} size="lg" />
          <span>linkedin.com/in/malik-abdul-basit</span>
        </a>
      </div>
    </DefaultStyler>
  );
};

export default FooterTwo;
