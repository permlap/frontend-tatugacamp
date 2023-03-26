import React, { useState, Fragment, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { BiLogOutCircle, BiUser, BiWrench } from "react-icons/bi";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import Loading from "../loading/loading";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import Link from "next/link";
import {
  BsChevronCompactDown,
  BsChevronDoubleDown,
  BsChevronDown,
} from "react-icons/bs";
import { GetUser } from "../../service/user";

function AuthButton() {
  const [dropDown, setDropDown] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const { isLoading, data, refetch, isFetching } = useQuery(["user"], () =>
    GetUser()
  );

  //set accestoken to localstore
  useEffect(() => {
    if (router.query.access_token) {
      localStorage.setItem("access_token", router.query.access_token);
      console.log("store access_token");
      refetch();
    }
  }, [router.query?.access_token]);

  if (isFetching) {
    return <Loading />;
  }

  if (!data || data === "Unauthorized") {
    return (
      <div>
        <button
          onClick={() => router.push("/auth/signIn")}
          className="flex gap-x-2 justify-center items-center focus:outline-none text-base font-Inter font-normal border-0 w-max h-auto bg-white  text-black hover:ring-2  transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
        >
          <span>Login</span>
          <div className="flex items-center justify-center text-[#FFC800]">
            <FaUser size={23} />
          </div>
        </button>
      </div>
    );
  }

  const handleDropDown = () => {
    setDropDown((prev) => !prev);
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    queryClient.removeQueries("user");
    refetch();
    router.push({
      pathname: "/",
    });
  };

  return (
    <Menu>
      <Menu.Button
        className="flex bg-white w-46 relative z-20    border-0 cursor-pointer 
    rounded-md p-3   ring-orange-400 group
    items-center justify-center gap-x-3 "
      >
        {data.data.picture ? (
          <div className="relative w-10 h-10 rounded-md  overflow-hidden">
            <Image
              src={data.data.picture}
              alt={data.data.firstName}
              layout="fill"
              className=" object-cover "
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
            <span className="uppercase font-sans font-black text-3xl text-white">
              {data.data.firstName.charAt(0)}
            </span>
          </div>
        )}
        <span className=" text-sm h-min flex flex-col justify-center items-center gap-y-0  ">
          <span className="first-letter:uppercase font-semibold text-orange-400 ">
            {data.data.firstName} {data.data.lastName}
          </span>
        </span>
        <div className="group-hover:scale-0 transition duration-100 group-hover:opacity-0 ">
          <BsChevronCompactDown />
        </div>
        <div className="group-hover:scale-110 transition opacity-0 duration-200 group-hover:opacity-100 absolute right-3">
          <BsChevronDoubleDown />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="relative z-50">
          <Menu.Item>
            {({ active }) => (
              <ul
                role="button"
                className="list-none flex flex-col gap-y-4 bg-white rounded-md text-center drop-shadow-md p-2 md:absolute ml-10 mt-2 
        md:right-10 md:top-26 w-24 cursor-pointe  relative  "
              >
                <li
                  onClick={() =>
                    router.push({
                      pathname: "/classroom/setting",
                    })
                  }
                  className="flex justify-center items-center text-base font-light 
                  gap-x-2 hover:font-bold "
                >
                  <span>Account</span>
                  <span className="text-center flex items-center justify-center">
                    <BiUser />
                  </span>
                </li>
                <div className="arrow-left md:arrow-top absolute -left-3 top-auto bottom-auto"></div>
                <li
                  onClick={signOut}
                  className="flex justify-center items-center text-base font-light gap-x-2 hover:font-bold"
                >
                  <span>Logout</span>
                  <span className="text-center flex items-center justify-center">
                    <BiLogOutCircle />
                  </span>
                </li>
              </ul>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default AuthButton;
