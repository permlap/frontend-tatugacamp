import React from "react";
import FooterActivities from "./footer/FooterActivities";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
        <section>{children}</section>
      </main>
    </>
  );
}

export default Layout;
