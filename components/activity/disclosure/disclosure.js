import { Disclosure, Transition } from "@headlessui/react";
import { PortableText } from "@portabletext/react";
import { BsCaretDownFill } from "react-icons/bs";
import { urlFor } from "../../../sanity";
import Image from "next/image";
import { useState } from "react";

export default function DisclosureComponent({ body, video }) {
  const [loading, setLoading] = useState(true);
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

      number: ({ children }) => <span>{children}</span>,
    },
    block: {
      // Ex. 1: customizing common block types
      h1: ({ children }) => (
        <h1 className={` md:text-4xl text-lg py-5`}>{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className={`text-lg md:text-2xl py-3`}>{children}</h2>
      ),
      h3: ({ children }) => (
        <>
          <h3 className={`text-lg md:text-xl py-3`}>{children}</h3>
          <br />
        </>
      ),
      normal: ({ children }) => (
        <div className="text-base lg:text-lg ">{children}</div>
      ),

      blockquote: ({ children }) => (
        <blockquote className="border-l-purple-500 border-l-2 border-solid border-r-0 border-y-0 my-5 pl-5 font-semibold">
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
          <span className="group w-full relative cursor-pointer">
            <span
              className="w-max underline decoration-dotted font-semibold text-[#EDBA02] underline-offset-2 text-base 
            lg:text-lg"
            >
              {children}
            </span>
            <div
              className="group-hover:block z-20 group-active:block w-2/4  hidden bg-[#EDBA02] rounded-md text-left px-5
            font-Kanit font-light md:absolute md:w-80  md:right-[0%] md:left-0 "
            >
              <span className="w-max mr-1 font-normal">ความหมาย:</span>
              <span>{value.href}</span>
            </div>
          </span>
        );
      },
      em: ({ children }) => (
        <em className="text-gray-600 font-light text-base lg:text-lg">
          {children}
        </em>
      ),
      color: ({ children, value }) => (
        <span style={{ color: value.hex }}>{children}</span>
      ),
      link: ({ children, value }) => {
        return (
          <a
            href={value.href}
            className={`text-${value.hex}`}
            rel="noreferrer"
            target="_blank"
          >
            {children}
          </a>
        );
      },
    },
  };

  // check whether url of image is png or not. If not return false
  function isImage(url) {
    return /\.(|png|)$/.test(url);
  }

  const SanityImage = ({ asset }) => {
    const randomNumber = Math.floor(Math.random() * 4) + 1;

    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          style={{
            backgroundImage: isImage(urlFor(asset).url())
              ? `url(/BgBlob${randomNumber.toString()}.svg)`
              : "none",
          }}
          className={` lg:w-96 md:w-40 lg:h-96 md:h-40 h-56 w-56  bg-cover bg-no-repeat relative `}
        >
          <Image
            src={urlFor(asset).url()}
            layout="fill"
            className="object-contain"
            placeholder="blur"
            blurDataURL="/logo/TaTuga camp.png"
            alt="some images about TaTuga camp teaching you English grammar"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full   pt-5">
      <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl rounded-2xl flex justify-center items-center flex-col gap-y-5">
        {body.body && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96 justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm lg:text-base font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>วิธีการเล่นกิจกรรม 😲</span>
                  <BsCaretDownFill
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2 ">
                    <PortableText
                      value={body?.body}
                      components={myPortableTextComponents}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}

        {body.materialDetail && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96  justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm lg:text-base  font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>รายละเอียดอุปกรณ์ 🧰</span>
                  <BsCaretDownFill
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2">
                    <PortableText
                      value={body?.materialDetail}
                      components={myPortableTextComponents}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}

        {body.reflectionTipsStrategies && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96 justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm lg:text-base  font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>เทคนิคและรายละเอียดเพิ่มเติม 🗯️</span>
                  <BsCaretDownFill
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-purple-500`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2 ">
                    <PortableText
                      value={body?.reflectionTipsStrategies}
                      components={myPortableTextComponents}
                    />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}
      </div>
    </div>
  );
}
