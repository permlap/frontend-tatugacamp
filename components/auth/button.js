import React, { useState, Fragment, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { BiLogOutCircle, BiUser, BiWrench } from "react-icons/bi";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import Loading from "../loading/loading";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { GetUser } from "../../service/service";
import Link from "next/link";

function AuthButton() {
  const [dropDown, setDropDown] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);
  const [access_token, setAccess_token] = useState();
  const queryClient = useQueryClient();
  //set accestoken to localstore
  useEffect(() => {
    console.log("useEffect on saving access_token runs!");
    if (router.query.access_token) {
      localStorage.setItem("access_token", router.query.access_token);
      setAccess_token((prev) => (prev = localStorage.getItem("access_token")));
      setHasToken(true);
    }
    refetch();
  }, [router.query?.access_token]);

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    ["user"],
    () => GetUser(access_token),
    {
      enabled: hasToken,
    }
  );

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
    setAccess_token(null);
    refetch();
    queryClient.removeQueries("user");
  };

  return (
    <Menu>
      <Menu.Button
        className="flex bg-transparent relative border-0 cursor-pointer 
    hover:ring-2 rounded-md p-3 ring-orange-400 active:ring-4 
    items-center justify-center gap-x-3"
      >
        <span className="text-black text-sm h-min flex flex-col justify-center items-center gap-y-0  ">
          welcome
          <span className="first-letter:uppercase font-semibold text-white md:text-orange-400 ">
            {data.data.firstName} {data.data.lastName}
          </span>
        </span>

        {data.data.picture ? (
          <Image
            src={data.data.picture}
            alt={data.data.firstName}
            width={35}
            height={35}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
            <span className="uppercase font-sans font-black text-3xl text-white">
              {data.data.firstName.charAt(0)}
            </span>
          </div>
        )}
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
        <Menu.Items>
          <Menu.Item>
            {({ active }) => (
              <ul
                role="button"
                className="list-none flex flex-col gap-y-4 bg-white rounded-md text-center drop-shadow-md p-2 md:absolute ml-10 mt-2 
        md:right-10 md:top-26 w-24 cursor-pointer"
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
