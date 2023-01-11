import React from "react";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "../../data/portableContent";
function MainContent({ body }) {
  return (
    <div className="w-full h-full bg-[#2C7CD1] md:bg-transparent flex justify-center ">
      <div className="w-[90%] lg:w-max lg:p-11 h-max pb-8 bg-white   rounded-xl drop-shadow-lg mb-5">
        <ul className="list-none pl-0 flex flex-col justify-center items-center">
          <li className="mt-5"></li>
          <li>
            <ul className=" pl-0 lg:mt-0 ">
              {/* main content body */}
              <li className=" text-[#EDBA02] font-bold font-Kanit text-[1.5rem] md:text-[2rem] flex flex-col justify-center items-center">
                <span>วิธีการเล่น</span>
                <div className="w-max  h-2 bg-[#EDBA02] px-11 md:px-14 rounded-lg"></div>
              </li>
              <li className=" pl-0 w-full flex flex-col items-center font-Kanit text-lg justify-center">
                <span className="mt-10 w-auto md:w-96 lg:w-[30rem] mx-5 md:mx-0 flex justify-center  flex-col">
                  <PortableText
                    value={body}
                    components={myPortableTextComponents}
                  />
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainContent;
