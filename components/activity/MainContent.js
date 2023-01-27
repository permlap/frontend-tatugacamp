import React from "react";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "../../data/portableContent";
import { Disclosure } from "@headlessui/react";
import DisclosureComponent from "./disclosure/disclosure";
function MainContent({
  body,
  reflectionTipsStrategies,
  materialDetail,
  video,
}) {
  const Newbody = { body, reflectionTipsStrategies, materialDetail };

  return (
    <div className="w-full h-full bg-[#2C7CD1] md:bg-transparent flex justify-center ">
      <div className="w-[90%] lg:w-2/4 lg:p-11 h-full pb-20 lg:pb-36 border-2 md:border-solid   bg-white   rounded-xl drop-shadow-lg ">
        <ul className="list-none pl-0 flex flex-col justify-center items-center">
          <li className="mt-5"></li>
          <li>
            <ul className=" pl-0 lg:mt-0  ">
              {/* main content body */}
              <li className=" text-[#EDBA02] font-bold  font-Kanit text-[1.5rem] md:text-[1.5rem] flex flex-col justify-center items-center">
                <span className="underLineHover">รายละเอียดกิจกรรม</span>
              </li>
              <li className=" pl-0 w-full  flex flex-col items-center font-Kanit text-lg justify-center">
                <DisclosureComponent body={Newbody} video={video} />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainContent;
