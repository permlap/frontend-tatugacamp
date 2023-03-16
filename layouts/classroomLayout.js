import React, { useEffect, useState } from "react";
import { FiChevronsLeft, FiChevronsRight, FiSidebar } from "react-icons/fi";

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
          className="text-2xl mt-5 ml-5 fixed z-20 w-10 h-10 
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
