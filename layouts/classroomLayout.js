import React, { useEffect, useState } from "react";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

import SidebarClassroom from "../components/sidebar/sidebarClassroom";

function Layout({ children, user, sideMenus, trigger }) {
  const [triggersidebar, setTriggerSidebar] = useState(true);

  return (
    <>
      <main>
        <div
          onClick={() => {
            setTriggerSidebar((prev) => !prev);
            trigger && trigger((prev) => (prev = triggersidebar));
          }}
          aria-label="Show sidebar"
          role="button"
          className="text-4xl mt-5 ml-5 fixed z-30 w-10 h-10 bg-[#FFC800] 
        flex justify-center items-center rounded-full text-white drop-shadow cursor-pointer
        hover:scale-105 transition duration-100 ease-in-out active:bg-[#2C7CD1]"
        >
          {triggersidebar ? <FiChevronsLeft /> : <FiChevronsRight />}
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
