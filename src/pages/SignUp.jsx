import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline, IoLogoApple } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../components/UI/CustomButton";
import SideImage from "../assets/signIn/signIn.jpg";
import { AuthContext } from "../context/AuthContext";

function SignUp() {
  const navigate = useNavigate();
  const { setUser, login } = useContext(AuthContext);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleGoogleSignIn = () => {
    toast.error("Google Sign-In not implemented in mock mode");
  };

  const handleAppleSignIn = () => {
    toast.error("Apple Sign-In not implemented in mock mode");
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  const handleFullNameBlur = () => {
    if (!fullName) {
      setFullNameError("Full name is required");
      toast.error("Full name is required");
    }
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError("Email is required");
      toast.error("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      toast.error("Please enter a valid email");
    }
  };

  const handleFormSubmit = async () => {
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!fullName) {
      setFullNameError("Full name is required");
      return toast.error("Full name is required");
    }

    if (!email) {
      setEmailError("Email is required");
      return toast.error("Email is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email address");
      return toast.error("Invalid email address");
    }

    if (!password) {
      setPasswordError("Password is required");
      return toast.error("Password is required");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return toast.error("Passwords do not match");
    }

    try {
      // Check if email already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.some(user => user.email === email)) {
        setEmailError("Email already exists");
        return toast.error("Email already exists");
      }

      // Create new user with unique ID
      const newUser = { id: uuidv4(), fullName, email, password };
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Log in the new user
      login({ id: newUser.id, fullName, email });
      toast.success("Account created successfully!");
      navigate("/signin");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="mx-auto mt-20 lg:mt-0 flex w-full max-w-[1920px] flex-col lg:flex-row bg-white dark:bg-gray-900">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1f2937",
          },
          className: "dark:bg-gray-800 dark:text-gray-100",
        }}
      />

      <div className="hidden lg:block lg:w-[55%]">
        <img
          src={SideImage}
          alt="Laptop Background"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Form Section */}
      <div className="flex w-full flex-col px-[20px] pt-[20px] sm:px-[30px] sm:pt-[30px] md:px-20 lg:w-[45%] lg:px-[60px] lg:pt-[80px] 2xl:px-[165px] 2xl:pt-[154px]">
        {/* Logo - Visible on all screens */}
        <div className="w-full mb-4 hidden lg:block">
          <span className="text-4xl font-bold text-green-600 dark:text-green-500">GeoFinder</span>
        </div>

        {/* Sign Up Section */}
        <div className="flex w-full flex-col lg:mt-10">
          <h2 className="font-PlusSans text-[24px] font-bold leading-[32px] text-gray-900 dark:text-gray-100 lg:text-[36px]">
            Create Account
          </h2>
          <span className="mt-5 font-PlusSans text-sm font-medium leading-6 text-gray-700 dark:text-gray-300 lg:text-base lg:leading-8">
            Create your account to start exploring.
          </span>

          {/* Full Name Input */}
          <div className="mt-[32px]">
            <input
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              onBlur={handleFullNameBlur}
              placeholder="Full Name"
              className="w-full font-PlusSans text-[14px] font-normal leading-[24px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div className="mt-[4px] h-[1px] w-full bg-gray-900 dark:bg-gray-300"></div>
            {fullNameError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{fullNameError}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="mt-[32px]">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              placeholder="Username@example.com"
              className="w-full font-PlusSans text-[14px] font-normal leading-[24px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div className="mt-[4px] h-[1px] w-full bg-gray-900 dark:bg-gray-300"></div>
            {emailError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{emailError}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative mt-[36px]">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create Password"
              className="w-full font-PlusSans text-[14px] font-normal leading-[24px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <IoEyeOutline size={20} className="text-gray-500 dark:text-gray-400" />
              ) : (
                <IoEyeOffOutline size={20} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="mt-[4px] h-[1px] w-full bg-gray-900 dark:bg-gray-300"></div>
            {passwordError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative mt-[36px]">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              className="w-full font-PlusSans text-[14px] font-normal leading-[24px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none bg-transparent"
            />
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 transform cursor-pointer"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? (
                <IoEyeOutline size={20} className="text-gray-500 dark:text-gray-400" />
              ) : (
                <IoEyeOffOutline size={20} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="mt-[4px] h-[1px] w-full bg-gray-900 dark:bg-gray-300"></div>
            {confirmPasswordError && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{confirmPasswordError}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <div className="mt-[32px] w-full">
            <CustomButton
              title="Create Account"
              bgColor="bg-green-600 dark:bg-green-500"
              textColor="text-white dark:text-gray-100"
              onClick={handleFormSubmit}
              style="hover:bg-green-700 dark:hover:bg-green-600"
            />
          </div>

          <div className="mt-[23px] flex items-center justify-center font-PlusSans text-sm leading-6 text-gray-700 dark:text-gray-300">
            or continue with
          </div>

          {/* Social Login Buttons */}
          <div className="mt-[24px] flex items-center justify-center space-x-[9px] lg:mt-[46px]">
            <div
              className="flex h-[46px] w-[105px] cursor-pointer items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-2 hover:border-green-600 dark:hover:border-green-500"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={24} />
            </div>
            <div
              className="flex h-[46px] w-[105px] cursor-pointer items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-2 hover:border-green-600 dark:hover:border-green-500"
              onClick={handleAppleSignIn}
            >
              <IoLogoApple size={24} className="text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          {/* Sign In Link */}
          <h1 className="mt-[12px] flex items-center justify-center font-PlusSans text-sm leading-6 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <span
              className="ml-2.5 cursor-pointer font-semibold text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </h1>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-center py-3 font-PlusSans text-xs leading-6 text-gray-700 dark:text-gray-300 lg:py-7">
          2025 © All rights reserved. GeoFinder
        </div>
      </div>
    </div>
  );
}

export default SignUp;