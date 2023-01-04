import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import React, { useState } from "react";
import Listmenu from "../svg/Listmenu";

import Logo from "../svg/Logo";
function Layout({ children, triggerMenu }) {
  const [isShow, setIsShow] = useState(false);

  return (
    <>
      <main>
        {/* Phone point of view */}

        <ul className="md:hidden fixed flex w-screen h-20 z-50  text-white bg-transparent justify-between list-none pl-0  content-center items-center">
          <Button
            onClick={triggerMenu}
            className="w-[50px] h-[50px] rounded-full"
          >
            <li className="w-[50px] h-[50px] bg-[#EDBA02] active:bg-[#2C7CD1] flex items-center justify-center rounded-full text-white">
              <Listmenu />
            </li>
          </Button>
          <li className="mr-2 px-4 py-2 rounded-md bg-[#2C7CD1] flex items-center gap-x-2 text-[20px] ">
            <div>
              <a
                className="no-underline text-white"
                target="_blank"
                href="https://www.facebook.com/TaTugaCamp"
                rel="noopener noreferrer"
              >
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </div>
            <div>
              <ion-icon name="logo-youtube"></ion-icon>
            </div>
            <div>
              <ion-icon name="logo-instagram"></ion-icon>
            </div>
            <div className="w-[35px] h-[35px] rounded-full overflow-hidden">
              <Link href="/">
                <Image
                  src="/TaTuga camp.png"
                  width={35}
                  height={35}
                  alt="TaTuga camp logo"
                />
              </Link>
            </div>
          </li>
        </ul>
        <section>{children}</section>
      </main>
    </>
  );
}

export default Layout;
