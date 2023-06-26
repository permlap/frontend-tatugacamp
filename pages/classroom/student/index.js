import Layout from "../../../components/layout";
import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { BsCheck2 } from "react-icons/bs";
import { HiChevronUpDown } from "react-icons/hi2";
import { JoinClassroom } from "../../../service/student/classroom";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { BiError } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import Head from "next/head";

function Index() {
  const [people, setPeople] = useState();
  const [selected, setSelected] = useState(people?.[0]);
  const [query, setQuery] = useState("");
  const rounter = useRouter();
  const [loading, setLoading] = useState(false);
  const classroom = useQuery(
    ["classroom-student"],
    () =>
      JoinClassroom({ classroomCode: rounter.query.classroomCode }).then(
        (res) => {
          localStorage.setItem("teacher", JSON.stringify(res.data.teacher));
          localStorage.setItem(
            "classroom-student",
            JSON.stringify(res.data.classroom)
          );
          return res;
        }
      ),
    {
      enabled: false,
    }
  );
  // set people
  useEffect(() => {
    if (classroom.isError) {
      setPeople("");
    }
    setPeople(classroom?.data?.data?.students);
  }, [classroom.data]);

  // fetch classroom when router is ready
  useEffect(() => {
    classroom.refetch();
  }, [rounter.isReady, rounter.query.classroomCode]);
  const filteredPeople =
    query === ""
      ? people
      : people?.filter((person) =>
          person.firstName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="h-screen md:h-screen bg-slate-100 relative ">
      <Head>
        <title>{`${
          classroom.isError
            ? "โปรดกรอกรหัสใหม่"
            : `ข้อตอนรับสู่ห้องเรียน คุณครู${classroom?.data?.data?.teacher?.firstName}`
        }`}</title>
      </Head>
      <Layout unLoading={true}>
        {!classroom.isError && (
          <div
            className=" bg-cover h-60 w-full absolute  bg-center bg-no-repeat 
         bg-[url('https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png')] "
          ></div>
        )}
        <div className="h-[40rem] w-full  flex items-center   pt-28 md:pt-0 font-Kanit">
          <main className="w-full flex justify-center ">
            {classroom.isLoading ||
              (loading === true && (
                <div className="flex items-center justify-center flex-col  w-full">
                  <Skeleton variant="circular" width={120} height={120} />
                  <Skeleton
                    variant="text"
                    width={200}
                    sx={{ fontSize: "1rem" }}
                  />
                  <div className="mt-10 flex flex-col gap-4 justify-center items-center">
                    <Skeleton variant="rounded" width={300} height={60} />
                    <Skeleton variant="rounded" width={210} height={60} />
                  </div>
                </div>
              ))}
            {classroom.isError && (
              <div className="flex flex-col h-full  ">
                <div className=" flex items-center justify-center gap-2">
                  <span className="font-Kanit text-3xl font-semibold text-red-500">
                    ไม่พบห้องเรียน
                  </span>
                  <div className="text-3xl text-red-500">
                    <BiError />
                  </div>
                </div>

                <span className="text-red-400">โปรดกรอกรหัสใหม่</span>
              </div>
            )}

            {classroom.data && !classroom.isError && loading === false && (
              <div
                className="flex flex-col md:flex-row gap-2 max-w-xl w-5/6 md:w-full md:max-w-4xl
               z-30 justify-center md:justify-center  items-center "
              >
                <div className="w-full flex flex-col justify-center  md:w-80 ">
                  <div className="w-full flex gap-2 flex-col items-center justify-center mb-5">
                    {classroom?.data?.data?.teacher?.picture ? (
                      <div className="w-40 h-40 md:w-60 md:h-60 ring-4 ring-blue-600 relative rounded-full overflow-hidden bg-white">
                        <Image
                          src={classroom?.data?.data?.teacher?.picture}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 relative rounded-full overflow-hidden flex items-center justify-center bg-white">
                        <span className="text-4xl uppercase font-Kanit font-semibold text-blue-500">
                          {classroom?.data?.data?.teacher?.firstName?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex font-Poppins font-semibold text-2xl">
                      <span>welcome to</span>
                    </div>
                    <div className="flex gap-1 font-Kanit  text-blue-500 font-semibold">
                      <span>ห้องเรียนของครู</span>
                      <span className="">
                        {classroom?.data?.data?.teacher?.firstName}
                      </span>
                    </div>
                  </div>
                  <div></div>
                </div>

                <div className="w-10/12 md:w-96 ring-2 ring-blue-500 rounded-2xl relative z-20 bg-white p-4">
                  <div className="w-full flex flex-col mb-5 ">
                    <span className="text-blue-500 truncate  font-Kanit text-4xl font-semibold">
                      {classroom?.data?.data?.classroom?.title}
                    </span>
                    <span className="text-orange-400 font-Kanit font-semibold">
                      {classroom?.data?.data?.classroom?.level}
                    </span>
                    <span className="text-black   font-Kanit font-semibold">
                      {classroom?.data?.data?.classroom?.description}
                    </span>
                  </div>
                  <span className="font-Kanit text-lg font-semibold text-[#EDBA02] ">
                    เลือกชื่อของตัวเอง
                  </span>
                  <Combobox value={selected} onChange={setSelected}>
                    <div className="relative ">
                      <div
                        className="relative w-full cursor-default overflow-hidden rounded-lg ring-2 ring-blue-500
                      text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white
                       focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
                      >
                        <Combobox.Input
                          autoComplete="off"
                          className="w-full border-none  py-2 pl-3 pr-10 text-sm leading-5 
                         text-gray-900 focus:ring-0 focus:border-none outline-none
                        active:border-none"
                          displayValue={(person) =>
                            `${person.firstName}  ${person?.lastName}`
                          }
                          onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button
                          role="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-2 bg-transparent border-none"
                        >
                          <HiChevronUpDown
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                      >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md list-none pl-0 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredPeople?.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              Nothing found.
                            </div>
                          ) : (
                            filteredPeople?.map((person) => (
                              <Combobox.Option
                                key={person.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-[#EDBA02] text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {person.firstName} {person?.lastName}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active
                                            ? "text-white"
                                            : "text-teal-600"
                                        }`}
                                      >
                                        <BsCheck2
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>
                  <div className="w-full flex items-center justify-center">
                    {selected ? (
                      <button
                        onClick={() => {
                          setLoading(true);
                          const serializedClassroomCode = JSON.stringify(
                            rounter.query.classroomCode
                          );
                          localStorage.setItem(
                            "classroomCode",
                            serializedClassroomCode
                          );
                          rounter.push({
                            pathname: `/classroom/student/${selected?.id}`,
                            query: {
                              classroomId: classroom?.data?.data?.classroom?.id,
                            },
                          });
                        }}
                        type="button"
                        className=" text-white bg-blue-500 mt-6
                         hover:bg-[#EDBA02] hover:scale-110 transition duration-150
               py-2 px-4 w-2/4 font-Poppins rounded-md  font-semibold "
                      >
                        Join
                      </button>
                    ) : (
                      <div
                        className=" text-white flex items-center justify-center bg-gray-600 mt-6 
           py-2 px-4 w-2/4 font-Poppins rounded-md ring-2 font-semibold ring-white border-white"
                      >
                        โปรดเลือกก่อน
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </Layout>
    </div>
  );
}

export default Index;
