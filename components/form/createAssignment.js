import React from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";

export default function CreateAssignment({ close }) {
  const handleSubmit = async () => {};
  return (
    <div>
      <div
        className="flex w-5/6  h-5/6 font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-40 
    top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <div className="w-full flex">
          <form className="flex-col flex bg-slate-300 gap-4 w-3/4">
            <div className="flex flex-col gap-0">
              <label className="relative cursor-pointer">
                <input
                  type="text"
                  placeholder="title"
                  className="h-10 w-3/4 pl-5 text-xl text-black appearance-none ring-2 ring-black
                    border-0 rounded-lg border-opacity-50 outline-none focus:ring-black
                    placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                />
                <span
                  className="text-2xl   bg-white  text-black
                 text-opacity-80  absolute left-5 top-2 px-1 transition duration-200 input-text"
                >
                  Title
                </span>
              </label>
            </div>
            <div className="flex flex-col gap-0">
              <label className="relative cursor-pointer">
                <textarea
                  type="text"
                  placeholder="title"
                  className="h-10 w-3/4 pl-5 text-xl text-black appearance-none ring-2 ring-black
                    border-0 rounded-lg border-opacity-50 outline-none focus:ring-black
                    placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                />
                <span
                  className="text-2xl   bg-white  text-black
                 text-opacity-80  absolute left-5 top-2 px-1 transition duration-200 input-text"
                >
                  Title
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
      <div
        onClick={() => close()}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}
