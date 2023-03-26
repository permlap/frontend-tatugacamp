import { Popover, Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { FiChevronsLeft, FiChevronsRight, FiSidebar } from "react-icons/fi";
import AuthButton from "../components/auth/button";

import SidebarClassroom from "../components/sidebar/sidebarClassroom";

function Layout({ children, user, sideMenus, trigger }) {
  const [triggersidebar, setTriggerSidebar] = useState(true);
  console.log(user.data);
  return (
    <main className=" ">
      <div className="absolute top-0 right-0 mr-5 mt-5">
        <AuthButton />
      </div>
      <Popover className="relative">
        {({ open }) => (
          <>
            {!user.isError && (
              <Popover.Button className="w-max bg-transparent h-max border-none active:border-none z-30 absolute">
                <div
                  aria-label="Show sidebar"
                  role="button"
                  className="text-2xl mt-5 ml-5 fixed z-30 w-10 h-10 
        flex justify-center items-center   text-black drop-shadow cursor-pointer
        hover:scale-125 transition duration-100 ease-in-out "
                >
                  <FiSidebar />
                </div>
              </Popover.Button>
            )}
            <Transition>
              <Popover.Panel>
                {({ close }) => (
                  <SidebarClassroom
                    sideMenus={sideMenus}
                    user={user}
                    triggersidebar={triggersidebar}
                    close={close}
                  />
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <section>{children}</section>
    </main>
  );
}

export default Layout;
