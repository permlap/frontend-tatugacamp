import { Disclosure, Transition } from "@headlessui/react";
import { PortableText } from "@portabletext/react";
import { BsCheckLg, BsCaretDownFill } from "react-icons/bs";
import { myPortableTextComponents } from "../../data/portableContent";

export default function Example({ body }) {
  return (
    <div className="w-full  pt-5">
      <div className="mx-auto w-full max-w-md rounded-2xl flex justify-center items-center flex-col gap-y-5">
        {body.body && (
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className="border-0 flex w-64 md:w-96 justify-between rounded-lg bg-purple-100 
              px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>วิธีการเล่นกิจกรรม</span>
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
              px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>รายละเอียดอุปกรณ์</span>
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
              px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 
              focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                >
                  <span>เทคนิคและรายละเอียดเพิ่มเติม</span>
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
