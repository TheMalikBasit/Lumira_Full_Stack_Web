import { SignInButton, UserButton } from "@clerk/nextjs";
import ButtonSvg from "../assets/svg/ButtonSvg";
import { BagIcon, CartIcon } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";

const Button = ({
  className,
  href,
  onclick,
  children,
  px,
  white,
  clerk,
  user,
  router,
}) => {
  const classes = `button h-11 relative inline-flex items-center justify-center transition-colors text-neutral-950 hover:text-color-1 
  ${px || "px-7"} 
  ${white ? "text-n-8" : "text-n-1"} 
  ${className || ""}`;

  const spanClasses = `relative z-10`;

  const { isSignedIn } = useUser();

  const renderButton = () => (
    <button className={classes} onClick={onclick}>
      <span className="flex flex-row items-center gap-2 relative z-10">
        {children}
      </span>
      {ButtonSvg(white)}
    </button>
  );

  const renderClerkButton = () =>
    isSignedIn ? (
      <button className="relative ml-5 inline-flex justify-center border-2 border-orange-500 rounded-full p-[2px]">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-9 h-9", // Adjust width & height
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Action
              label="Cart"
              labelIcon={<CartIcon />}
              onClick={() => router.push("/cart")}
            />
            <UserButton.Action
              label="My Orders"
              labelIcon={<BagIcon />}
              onClick={() => router.push("/my-orders")}
            />
          </UserButton.MenuItems>
        </UserButton>
      </button>
    ) : (
      <SignInButton mode="modal">
        <button className={classes}>
          <span className={spanClasses}>{children}</span>
          {ButtonSvg(white)}
        </button>
      </SignInButton>
    );

  // <SignInButton mode="modal">
  //   {user ? (
  //     <button className="relative ml-5 inline-flex justify-center">
  //       <UserButton
  //         appearance={{
  //           elements: {
  //             userButtonAvatarBox: "w-9 h-9", // Adjust width & height
  //           },
  //         }}
  //       >
  //         <UserButton.MenuItems>
  //           <UserButton.Action
  //             label="Cart"
  //             labelIcon={<CartIcon />}
  //             onClick={() => router.push("/cart")}
  //           />
  //           <UserButton.Action
  //             label="My Orders"
  //             labelIcon={<BagIcon />}
  //             onClick={() => router.push("/my-orders")}
  //           />
  //         </UserButton.MenuItems>
  //       </UserButton>
  //     </button>
  //   ) : (
  //     <button className={classes}>
  //       <span className={spanClasses}>{children}</span>
  //       {ButtonSvg(white)}
  //     </button>
  //   )}
  // </SignInButton>
  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </a>
  );
  return href ? renderLink() : clerk ? renderClerkButton() : renderButton();
};

export default Button;
