import React, { useState } from "react";
import axios from "axios";
import Layout from "../../../components/layout";
import Hands from "../../../components/svg/Hands";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiLockClosed } from "react-icons/hi";
import { BsFacebook } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

function Index() {
  const router = useRouter();
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Please enter email.";
          }
          break;

        case "firstName":
          if (!value) {
            stateObj[name] = "First name required";
          }
          break;

        case "lastName":
          if (!value) {
            stateObj[name] = "Last name required";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj["confirmPassword"] = "Password does not match.";
          } else {
            stateObj["confirmPassword"] = input.confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Enter Confirm Password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  //handle login locally
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);

    try {
      const data = await axios.post(
        `${process.env.Server_Url}/auth/sign-up/`,
        {
          email: inputObject.email,
          password: inputObject.password,
          firstName: inputObject.firstName,
          lastName: inputObject.lastName,
          provider: "JWT",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data.access_token) {
        Swal.fire({
          icon: "success",
          title: "Login success",
        });
        router.push(`/?access_token=${data.data.access_token}`, undefined, {
          shallow: true,
        });
      }
      console.log(data);
    } catch (err) {
      if (err.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "error",
          title: "Login error",
          text: err.response.data.message,
        });
      } else {
        console.log(err);
      }
    }
  };

  //handle login from thrid party google auth
  const GetAccesTokenGoogle = async () => {
    router.push(`${process.env.Server_Url}/auth/google/redirect`, undefined, {
      shallow: true,
    });
  };

  const GetAccesTokenFacebook = async () => {
    router.push(`${process.env.Server_Url}/auth/facebook/redirect`, undefined, {
      shallow: true,
    });
  };

  return (
    <Layout>
      <div
        className="font-sans h-screen w-full bg-[url('/background-Auth.svg')] bg-no-repeat bg-cover
     flex flex-col justify-center items-center"
      >
        <div
          className="w-full md:w-96  h-max md:h-max md:pb-20 md:border-2 flex  flex-col justify-start items-center 
        md:border-solid broder-black relative rounded-xl bg-transparent md:bg-white md:drop-shadow-md "
        >
          <div
            className=" w-28 h-16 border-t-0 rounded-br-3xl  rounded-bl-3xl px-5 
           border-y-2 md:border-solid absolute right-0 left-0 mx-auto -top-[2px] bg-white"
          >
            <div className="w-full h-2 bg-white  absolute right-0 left-0 mx-auto -top-[2px]"></div>
            <div className="w-28 h-28 absolute -top-14">
              <Hands />
            </div>
          </div>
          <div className="mt-20">
            <span className="font-sans font-bold text-2xl  tracking-widest">
              sign up
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" w-80 flex flex-col justify-center items-center"
          >
            <div className="flex flex-col relative">
              <label className="font-sans font-normal">email</label>
              <input
                required
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] focus:bg-[#FFC800] active:bg-[#FFC800]  pl-10 
                placeholder:italic placeholder:font-light"
                type="text"
                name="email"
                placeholder="type your email"
                value={input.email}
                onChange={onInputChange}
                onBlur={validateInput}
              />
              {error.email && (
                <span className=" absolute -right-10 text-red-400 font-light">
                  {error.email}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <FaUserCircle />
              </div>
            </div>
            <div className="grid grid-flow-col  justify-center items-center gap-x-5 w-full ">
              <div className="flex flex-col relative">
                <label className="font-sans font-normal">first name</label>
                <input
                  required
                  className="w-full h-7 rounded-md border-none bg-[#FFC800] 
                placeholder:italic placeholder:font-light pl-3"
                  type="text"
                  name="firstName"
                  placeholder="type your first"
                  value={input.firstName}
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {error.firstName && (
                  <span className=" absolute -right-2 top-1 text-red-400 font-light text-xs ">
                    {error.firstName}
                  </span>
                )}
              </div>

              <div className="flex flex-col relative">
                <label className="font-sans font-normal">last name</label>
                <input
                  required
                  className="w-full h-7 rounded-md border-none bg-[#FFC800] 
                placeholder:italic placeholder:font-light pl-3"
                  type="text"
                  name="lastName"
                  placeholder="type your last name"
                  value={input.lastName}
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {error.lastName && (
                  <span className=" absolute -right-2 top-1 text-red-400 font-light text-xs">
                    {error.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">Password</label>
              <input
                required
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="password"
                placeholder="type your password"
                value={input.password}
                onChange={onInputChange}
                onBlur={validateInput}
              />
              {error.password && (
                <span className="absolute -right-10 text-red-400 font-light">
                  {error.password}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <HiLockClosed />
              </div>
            </div>
            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">Confirm password</label>
              <input
                required
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={input.confirmPassword}
                onChange={onInputChange}
                onBlur={validateInput}
              />
              {error.confirmPassword && (
                <span className="absolute -right-10 text-sm text-red-400 font-light">
                  {error.confirmPassword}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <HiLockClosed />
              </div>
            </div>
            <div className="w-full text-right mt-1">
              <Link href="/auth/signIn">
                <span
                  className="cursor-pointer text-sm  font-Kanit font-medium text-blue-700 
                 bg-white px-2 rounded-lg border-black broder-2 border-solid md:border-none"
                >
                  มีบัญชีแล้ว🤗
                </span>
              </Link>
            </div>
            {!error.confirmPassword && !error.password && !error.email ? (
              <button
                className="w-full border-none h-9 mt-2 font-Kanit rounded-full bg-[#2C7CD1] hover:text-black text-white font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                ลงทะเบียน
              </button>
            ) : (
              <div
                className="w-full border-none h-9 mt-2 font-Kanit rounded-full bg-[#606060] text-white font-bold
            text-md cursor-pointer text-sm  focus:border-2  flex items-center justify-center active:border-none 
            focus:border-solid"
              >
                ลงทะเบียน
              </div>
            )}
          </form>
          <div className="w-80">
            <a
              onClick={GetAccesTokenGoogle}
              className="w-full  h-9 mt-2 rounded-full bg-white text-black font-sans font-bold
              text-md cursor-pointer border-2 border-solid hover:scale-110 transition duration-200  ease-in-out
                active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid flex items-center justify-center gap-x-2"
            >
              <div className="flex items-center justify-center text-2xl">
                <FcGoogle />
              </div>
              <span>continue with Google</span>
            </a>

            <button
              onClick={GetAccesTokenFacebook}
              className="w-full  h-9 mt-2 rounded-full bg-white text-black font-sans font-bold cursor-pointer
              text-md cursor-pointer:border-2 border-solid hover:scale-110 transition duration-200  ease-in-out
               active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid flex items-center justify-center gap-x-2"
            >
              <div className="flex items-center justify-center text-2xl text-[#3b5998] ">
                <BsFacebook />
              </div>
              <span>continue with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
