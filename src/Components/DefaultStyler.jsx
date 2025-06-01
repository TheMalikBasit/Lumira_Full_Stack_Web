import SectionSvg from "../assets/svg/SectionSvg";

const DefaultStyler = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPadding,
  children,
}) => {
  return (
    <div
      id={id}
      className={`relative 
    ${customPadding || "py-10 lg:py-16 xl:py-20"} 
    ${crosses ? "lg:py-32 xl:py-40" : ""} 
    ${className || ""}`}
    >
      {children}
      <div className="hidden absolute bg-n-1 h-full w-0.25 top-0 pointer-events-none md:block left-5 lg:left-7.5 xl:left-10" />
      <div className="hidden absolute bg-n-1 h-full w-0.25 top-0 pointer-events-none md:block right-5 lg:right-7.5 xl:right-10" />
      {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-n-1 
                ${crossesOffset && crossesOffset} 
                pointer-events-none lg:block xl:left-10 right-10`}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

export default DefaultStyler;
