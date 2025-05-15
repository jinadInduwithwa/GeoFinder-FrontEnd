const CustomButton = ({
    title,
    bgColor = "bg-green-600",
    textColor = "text-white",
    height = "44px",
    onClick,
    style = "",
  }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full ${bgColor} ${textColor} ${style} transition-all duration-300`}
        style={{ height }}
      >
        {title}
      </button>
    );
  };
  
  export default CustomButton;