import React, { useEffect, useState } from "react";
import { FiChevronsLeft, FiChevronsRight, FiSidebar } from "react-icons/fi";
import AuthButton from "../components/auth/button";

import SidebarClassroom from "../components/sidebar/sidebarClassroom";

function Layout({ children, user, sideMenus, trigger }) {
  const [triggersidebar, setTriggerSidebar] = useState(false);

  return (
    <>
      <main className="">
        <div className="absolute top-0 right-0 mr-5 mt-5">
          <AuthButton />
        </div>
        <div
          onClick={() => {
            setTriggerSidebar((prev) => !prev);
            trigger && trigger((prev) => (prev = triggersidebar));
          }}
          aria-label="Show sidebar"
          role="button"
          className="text-2xl mt-5 ml-5 fixed z-30 w-10 h-10 
        flex justify-center items-center  text-black drop-shadow cursor-pointer
        hover:scale-125 transition duration-100 ease-in-out"
        >
          <FiSidebar />
        </div>
        <SidebarClassroom
          sideMenus={sideMenus}
          user={user}
          triggersidebar={triggersidebar}
        />
        <section>{children}</section>
      </main>
    </>
  );
}

export default Layout;
