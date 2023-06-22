import { Popover, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import AuthButton from "../components/auth/button";

import SidebarClassroom from "../components/sidebar/sidebarClassroom";

function Layout({ children, user, sideMenus }) {
  const [triggersidebar, setTriggerSidebar] = useState(true);

  return (
    <main className="">
      <div className="absolute top-0 right-0 mr-5 mt-5">
        <AuthButton />
      </div>
      <Popover className="fixed z-40 top-0 left-0 mr-5 mt-5 ">
        {({ open }) => (
          <>
            {user && (
              <Popover.Button className="w-max  h-max border-none active:border-none z-30 absolute">
                <div className="flex p-2 ml-2 flex-col justify-center items-center ">
                  <div
                    aria-label="Show sidebar"
                    role="button"
                    className="text-2xl  z-30 w-10 h-10 
        flex justify-center items-center   text-black drop-shadow cursor-pointer
        hover:scale-125 transition duration-100 ease-in-out "
                  >
                    <FiSidebar />
                  </div>
                  <span>menu</span>
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
