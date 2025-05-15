import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Button = ({ to, onClick, children, icon: Icon, variant = "primary", className = "" }) => {
  const baseStyles = "inline-flex items-center gap-2 px-4 py-2  text-lg font-semibold transition-all duration-300";
  const variants = {
    primary: "bg-[#449e48] text-white hover:bg-[#3d8c40]  hover:scale-100",
    secondary: "bg-white text-green-600 hover:bg-gray-100 hover:scale-105"
  };

  const buttonContent = (
    <>
      {Icon && <Icon className="text-xl" />}
      {children}
    </>
  );

  if (to) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={to}
          className={`${baseStyles} ${variants[variant]} ${className}`}
        >
          {buttonContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {buttonContent}
    </motion.button>
  );
};

export default Button;