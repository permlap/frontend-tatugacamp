import React, { useState, Fragment } from "react";
import { FcGoogle } from "react-icons/fc";
import { BiLogOutCircle } from "react-icons/bi";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import Loading from "../loading/loading";
function AuthButton() {
  const [dropDown, setDropDown] = useState(false);
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return (
      <div>
        <button
          onClick={() => signIn()}
          className="flex gap-x-2 justify-center items-center focus:outline-none text-base font-Inter font-normal border-0 w-max h-auto bg-white  text-black hover:ring-2  transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
        >
          <span>Login</span>
          <FcGoogle size={23} />
        </button>
      </div>
    );
  }

  const handleDropDown = () => {
    setDropDown((prev) => !prev);
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
            {session.user.name}
          </span>
        </span>

        <Image
          src={session.user.image}
          alt={session.user.name}
          width={35}
          height={35}
          className="rounded-full"
        />
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
                onClick={() => signOut()}
                className="list-none bg-white rounded-md text-center drop-shadow-md p-2 md:absolute ml-10 mt-2 
        md:right-10 md:top-26 w-max cursor-pointer"
              >
                <div className="arrow-left md:arrow-top absolute -left-3 top-auto bottom-auto"></div>
                <li className="flex justify-center items-center text-base font-light gap-x-2">
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
