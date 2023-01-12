import { Button } from "@mui/material";
import Image from "next/image";
import React from "react";
import Call from "../svg/Call";
import Swal from "sweetalert2";
function Footer(props) {
  const dataFooter =
    "TaTuga camp is the place where you can enjoy learning English outside classrooms with a lot of activities and games. We DO believe that learning through playing is the best way to learn, especially English! Enjoy with us TaTuga camp";
  props.descriptionMeta(dataFooter);
  const date = new Date().toJSON().slice(0, 10);

  const telePhone = "0610277960";
  const handleClipbord = async () => {
    await navigator.clipboard.writeText(telePhone);
    Swal.fire("Copy เบอร์โทร 061-027-7960 เรียบร้อย");
  };
  return (
    <div>
      <div className="w-full h-full md:py-20 mt-0 justify-center flex flex-col md:flex-row pt-8 md:pt-2   text-center text-white items-center bg-transparent   ">
        <div className="md:w-max md:ml-16 ml-0 w-[10rem] h-[10rem]  md:h-max rounded-full overflow-hidden bg-white">
          <Image
            className="object-center rounded-full"
            width={300}
            height={300}
            alt="logo tatuga camp"
            src="/logo/TaTuga camp.png"
            priority
          />
        </div>
        <ul className="list-none text-center w-full pl-0 justify-center">
          <li>
            <div className="w-full flex justify-center">
              <div className="w-3/4 py-4 md:py-10 h-max ">
                <span className="md:text-md lg:text-2xl font-Inter font-thin ">
                  {dataFooter}
                </span>
              </div>
            </div>
          </li>
          <li className="w-full flex justify-center">
            <ul className="list-none flex justify-center mb-2  bg-white   px-8 rounded-xl shadow-md h-min w-min  ">
              <li>
                <Button>
                  <a
                    href="https://www.facebook.com/TaTugaCamp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      className="w-10 h-10 items-center"
                      viewBox="0 0 120 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M119.216 0.248779H0.286084C0.26683 0.248779 0.251221 0.264388 0.251221 0.283643V119.214C0.251221 119.233 0.26683 119.249 0.286084 119.249H119.216C119.236 119.249 119.251 119.233 119.251 119.214V0.283643C119.251 0.264388 119.236 0.248779 119.216 0.248779Z"
                        fill="#1877F2"
                      />
                      <path
                        d="M82.9004 76.948L85.55 59.7488H69.0481V48.5925C69.0481 43.8976 71.3491 39.2957 78.7401 39.2957H86.2473V24.6531C86.2473 24.6531 79.4374 23.491 72.9295 23.491C59.3329 23.491 50.4543 31.7187 50.4543 46.6402V59.7488H35.3469V76.948H50.4543V119.249H69.0481V76.948H82.9004Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </Button>
              </li>
              <li>
                <Button onClick={handleClipbord}>
                  <Call />
                </Button>
              </li>
            </ul>
          </li>
          <li className="flex w-full justify-center items-center">
            <div className="font-Inter font-thin mt-1 pb-3 md:pb-0 md:text-sm text-[0.65rem] w-3/4">
              {`Copyright © ${date} TaTuga camp. All rights reserved`}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
