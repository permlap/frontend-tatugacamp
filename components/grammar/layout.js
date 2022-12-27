import React from "react";
import SideMenuBar from "./sideMenuBar";

function Layout({ children }) {
  return (
    <>
      <SideMenuBar />
      <main>
        <section>{children}</section>
      </main>
    </>
  );
}

export default Layout;
