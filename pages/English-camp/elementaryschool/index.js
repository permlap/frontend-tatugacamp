import { Home } from "@mui/icons-material";
import React, { useState } from "react";
import Script from "next/script";

function Index() {
  const menu = [
    { name: "Home", icon: "home-outline", dis: "translate-x-[-4px]" },
    { name: "Profile", icon: "person-outline", dis: "translate-x-[61px]" },
    { name: "Message", icon: "chatbubble-outline", dis: "translate-x-[124px]" },
    { name: "Photos", icon: "camera-outline", dis: "translate-x-[190px]" },
    { name: "Settings", icon: "settings-outline", dis: "translate-x-[253px]" },
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="h-screen flex justify-center items-center bg-gray-900 font-Inter">
      <Script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      ></Script>
      <Script
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
      ></Script>
      <div className="bg-white max-h-[4.4rem] px-6 pb-2 rounded-t-xl">
        <ul className="list-none px-0 flex relative">
          <span
            className={`bg-rose-600 w-16 h-16 ${menu[active].dis} duration-700 border-4 border-gray-900 absolute -top-5 rounded-full border-solid`}
          >
            <span
              className="w-3.5 h-3.5 bg-transparent absolute top-4 -left-[17.5px] 
          rounded-tr-[6px] shadow-myShadow1"
            ></span>
            <span
              className="w-3.5 h-3.5 bg-transparent absolute top-4 -right-[17.5px] 
          rounded-tl-[6px] shadow-myShadow2"
            ></span>
          </span>
          {menu.map((menu, i) => (
            <li key={i} className="w-16">
              <a
                className="flex flex-col text-center pt-6"
                onClick={() => setActive(i)}
              >
                <span
                  className={`text-xl cursor-pointer ${
                    i === active && "-mt-5 duration-500 text-white"
                  }`}
                >
                  <ion-icon name={menu.icon}></ion-icon>
                </span>
                <span
                  className={` 
                    ${
                      active === i
                        ? "translate-y-5 duration-700 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                >
                  {menu.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Index;
