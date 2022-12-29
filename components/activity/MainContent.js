import Image from "next/image";
import { comment } from "postcss";
import React from "react";
import { urlFor } from "../../sanity";
import { PortableText } from "@portabletext/react";
function MainContent({ body }) {
  // const ListRender = props.body.filter((list) => list._type === "image");
  // const numRows = ListRender.length;

  //take array body and merge 2 array into one
  // const rows = props.body?.reduce(function (rows, key, index) {
  //   return (
  //     (index % 2 == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) &&
  //     rows
  //   );
  // }, []);
  // console.log(rows);

  //for styleing text from protable
  const myPortableTextComponents = {
    types: {
      image: ({ value }) => {
        return <SanityImage {...value} />;
      },
    },
    listItem: {
      // Ex. 1: customizing common list types
      bullet: ({ children }) => (
        <li className="list-disc pl-2 text-base lg:text-lg">{children}</li>
      ),

      // Ex. 2: rendering custom list items
      checkmarks: ({ children }) => <li>✅ {children}</li>,
    },
    block: {
      normal: ({ children }) => (
        <div className="text-base lg:text-lg">{children}</div>
      ),
      // Ex. 1: customizing common block types
      h1: ({ children }) => <h1 className={`text-4xl py-5`}>{children}</h1>,

      blockquote: ({ children }) => (
        <blockquote className="border-l-purple-500 border-l-8 border-solid border-r-0 border-y-0 my-5 pl-5 font-semibold">
          {children}
        </blockquote>
      ),

      // Ex. 2: rendering custom styles
      customHeading: ({ children }) => (
        <h2 className="text-lg text-primary text-purple-700">{children}</h2>
      ),
    },
    marks: {
      definition: ({ children, value }) => {
        return (
          <span
            definition={`ความหมาย : ${value.href}`}
            className="after:content-[attr(definition)]  after:w-max after:h-max after:p-3 after:drop-shadow-lg  after:bg-[#EDBA02] 
          after:font-Kanit after:font-normal after:text-base after:text-white after:rounded-lg
          after:top-5  relative after:-left-5 after:absolute hover:after:flex after:hidden cursor-pointer"
          >
            📚{children}
          </span>
        );
      },
      em: ({ children }) => (
        <em className="text-gray-600 font-light">{children}</em>
      ),
      color: ({ children, value }) => (
        <span style={{ color: value.hex }}>{children}</span>
      ),
      link: ({ children, value }) => {
        const rel = !value.href.startsWith("/")
          ? "noreferrer noopener"
          : undefined;
        return (
          <a href={value.href} className={`text-${value.hex}`} rel={rel}>
            {children}
          </a>
        );
      },
    },
  };

  const SanityImage = ({ asset }) => {
    const randomNumber = Math.floor(Math.random() * 4) + 1;
    return (
      <div className="w-full h-ful bg-transparent flex items-center justify-center">
        <div
          style={{
            backgroundImage: `url(/BgBlob${randomNumber.toString()}.svg)`,
          }}
          className={`lg:w-96 lg:h-96 h-56 w-56  bg-cover bg-no-repeat relative `}
        >
          <Image
            src={urlFor(asset).url()}
            layout="fill"
            className="object-contain"
            blurDataURL="LURfXxtP.8RRtRoLofWq?^aMMxo|"
          />
        </div>
      </div>
    );
  };
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
