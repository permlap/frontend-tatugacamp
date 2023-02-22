import React, { useEffect, useState } from "react";
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
import { currentBrowser } from "../../../utils/platforms";

function Index() {
  const [brower, setBrower] = useState();
  const router = useRouter();

  //check broser to prevent login google from social media brwoser
  useEffect(() => {
    setBrower(currentBrowser(window));
  }, []);
  //handle login locally
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputObject = Object.fromEntries(formData);

    try {
      const data = await axios.post(
        `${process.env.Server_Url}/auth/sign-in/`,
        {
          email: inputObject.username,
          password: inputObject.password,
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
    } catch (err) {
      if (err.code === "ERR_BAD_REQUEST") {
        Swal.fire({
          icon: "error",
          title: "Login error",
          text: err.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login error",
          text: "something wrong please try again next time",
        });
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
          className="w-full md:w-96  md:h-max md:pb-20 border-2 flex flex-col justify-start items-center 
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
              sign in
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" w-80 flex flex-col justify-center items-center"
          >
            <div className="flex flex-col relative">
              <label className="font-sans font-normal">Username</label>
              <input
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="text"
                name="username"
                placeholder="type your email"
              />
              <div
                className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <FaUserCircle />
              </div>
            </div>

            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">Password</label>
              <input
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="password"
                placeholder="type your password"
              />
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <HiLockClosed />
              </div>
            </div>
            <div className="w-full text-right mt-1">
              <Link href="/auth/signUp">
                <span
                  className="cursor-pointer text-sm  font-Kanit font-medium text-blue-700
                 bg-white px-2 rounded-lg border-black broder-2 border-solid md:border-none"
                >
                  ไม่มีบัญชี?
                </span>
              </Link>
            </div>
            <button
              className="w-full border-none h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
            >
              Login
            </button>
          </form>
          <div className="w-80">
            {brower !== "scoial media browser" ? (
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
            ) : (
              <a
                className="w-full  h-9 mt-2 rounded-full bg-gray-200 text-black font-sans font-bold
            text-md cursor-pointer border-2 border-solid hover:scale-110 transition duration-200  ease-in-out
              active:border-2 active:text-black active:border-gray-300
             active:border-solid  focus:border-2 
            focus:border-solid flex items-center justify-center gap-x-2"
              >
                <div className="flex items-center justify-center text-2xl">
                  <FcGoogle />
                </div>
                <span className="font-Kanit font-normal text-center text-sm text-black">
                  โปรดเปิดเบราว์เซอร์เพื่อ login ด้วย google
                </span>
              </a>
            )}

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
          <div>{brower}</div>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
