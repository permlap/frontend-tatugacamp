import Image from "next/image";
import { comment } from "postcss";
import React from "react";
import { urlFor } from "../../sanity";

function MainContent(props) {
  // const ListRender = props.body.filter((list) => list._type === "image");
  // const numRows = ListRender.length;
  const rows = props.body?.reduce(function (rows, key, index) {
    return (
      (index % 2 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) &&
      rows
    );
  }, []);

  return (
    <div className="w-full h-full bg-[#2C7CD1] md:bg-transparent flex justify-center ">
      <div className="w-[90%] lg:w-[75%] h-max pb-8 bg-white   rounded-xl drop-shadow-lg mb-5">
        <ul className="list-none pl-0 flex flex-col justify-center items-center">
          <li className="mt-5"></li>
          <li>
            <ul className=" pl-0 lg:mt-5 ">
              <li className=" text-[#EDBA02] font-bold font-Kanit text-[1.5rem] md:text-[2rem] flex flex-col justify-center items-center">
                <span>วิธีการเล่น</span>
                <div className="w-max  h-2 bg-[#EDBA02] px-11 md:px-14 rounded-lg"></div>
              </li>
              <li className=" pl-0 w-full flex flex-col items-center font-Kanit text-lg text-center justify-center">
                {rows?.map((lists, i) => {
                  const randomNumber = Math.floor(Math.random() * 4) + 1;

                  return (
                    <div
                      className={`pl-0 w-full flex flex-col  ${
                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      } items-center md:gap-x-8 font-Kanit text-lg text-justify justify-center mt-14`}
                      key={i}
                    >
                      {lists?.map((list) => {
                        return (
                          <div className={`pl-0 `} key={list?._key}>
                            {list._type === "image" && (
                              <div>
                                <div
                                  style={{
                                    backgroundImage: `url(/BgBlob${randomNumber.toString()}.svg)`,
                                  }}
                                  className={`w-80 h-80  bg-cover bg-no-repeat relative`}
                                >
                                  <Image
                                    src={urlFor(list.asset._ref).url()}
                                    layout="fill"
                                    className="object-contain"
                                    alt="tatuga game and activity for develop Englihs. Leaning through playing with us TaTuga camp"
                                    blurDataURL="LURfXxtP.8RRtRoLofWq?^aMMxo|"
                                    priority
                                  />
                                </div>
                              </div>
                            )}

                            {list._type === "block" && (
                              <div className="w-[17rem] md:w-[19rem] text-base md:text-lg lg:text-xl lg:w-[24rem] h-full">
                                {list.children.map((texts) => {
                                  return (
                                    // <span key={texts._key}>
                                    //   {texts.marks[0] === "strong" &&
                                    //     list.listItem !== "bullet" && (
                                    //       <span className="font-Kanit font-semibold">
                                    //         {texts.text}
                                    //       </span>
                                    //     )}

                                    //   {texts.marks[0] !== "strong" &&
                                    //     list.listItem !== "bullet" && (
                                    //       <span key={texts._key}>
                                    //         {texts.text}
                                    //       </span>
                                    //     )}
                                    // </span>

                                    <sapn
                                      key={texts._key}
                                      className={` ${
                                        list.listItem === "bullet"
                                          ? "list-disc"
                                          : "list-none"
                                      } pl-0 font-Kanit text-center `}
                                    >
                                      <span>
                                        <span
                                          className={` ${
                                            texts.marks[0] === "strong" &&
                                            "font-semibold"
                                          }`}
                                        >
                                          {/* {newText} */}

                                          {texts.marks[0] === "em" ? (
                                            <ul className="list-none  pl-0 text-left">
                                              <li> {texts.text}</li>
                                            </ul>
                                          ) : (
                                            <span>{texts.text}</span>
                                          )}
                                        </span>
                                      </span>
                                    </sapn>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainContent;
