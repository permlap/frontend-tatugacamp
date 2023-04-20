import Layout from "../../../components/layout";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

function Index() {
  return (
    <div>
      <Layout>
        <div
          className="h-screen w-full  bg-no-repeat bg-fixed bg-cover
     flex flex-col justify-center items-center font-Kanit"
        >
          <main>
            <form className="flex flex-col ">
              <span className="font-Kanit text-xl font-semibold">
                เลือกชื่อของตัวเอง
              </span>
            </form>
          </main>
        </div>
      </Layout>
    </div>
  );
}

export default Index;
