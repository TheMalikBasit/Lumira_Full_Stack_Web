import ButtonSvg from "../assets/svg/ButtonSvg";
import { SignInButton } from "@clerk/nextjs";

const Button = ({ className, href, onclick, children, px, white, clerk }) => {
  const classes = `button h-11 relative inline-flex items-center justify-center transition-colors hover:text-color-1 
  ${px || "px-7"} 
  ${white ? "text-n-8" : "text-n-1"} 
  ${className || ""}`;

  const spanClasses = `relative z-10`;

  const renderButton = () => (
    <button className={classes} onClick={onclick}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );

  const renderClerkButton = () => (
    <SignInButton mode="modal">
      <button className={classes}>
        <span className={spanClasses}>{children}</span>
        {ButtonSvg(white)}
      </button>
    </SignInButton>
  );
  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );
  return href ? renderLink() : clerk ? renderClerkButton() : renderButton();
};

export default Button;
