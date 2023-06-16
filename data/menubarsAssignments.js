import { useRouter } from "next/router";
import { FiArrowLeftCircle } from "react-icons/fi";
import React from "react";
export function sideMenusThai() {
  const router = useRouter();
  const sideMenus = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: `/classroom/teacher`,
    },
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `/classroom/teacher/${router.query.classroomId}`,
    },
    {
      title: "มอบหมายงาน",
      icon: "🎒",
      url: `#`,
    },
    {
      title: "ข้อมูลการเข้าเรียน",
      icon: "🙌",
      url: `/classroom/teacher/${router.query.classroomId}/attendance`,
    },
    {
      title: "คะแนนรวม",
      icon: "🥇",
      url: `/classroom/teacher/${router.query.classroomId}/scores`,
    },

    {
      title: "หน้าหลัก",
      icon: <FiArrowLeftCircle />,
      url: `/`,
    },
  ];
  return sideMenus;
}

export function sideMenusEnglish() {
  const router = useRouter();
  const sideMenus = [
    {
      title: "school",
      icon: "🏫",
      url: `/classroom/teacher`,
    },
    {
      title: "classroom",
      icon: "👨‍🏫",
      url: `/classroom/teacher/${router.query.classroomId}`,
    },
    {
      title: "assignments",
      icon: "🎒",
      url: `#`,
    },
    {
      title: "attendances",
      icon: "🙌",
      url: `/classroom/teacher/${router.query.classroomId}/attendance`,
    },
    {
      title: "scores",
      icon: "🥇",
      url: `/classroom/teacher/${router.query.classroomId}/scores`,
    },

    {
      title: "homepage",
      icon: <FiArrowLeftCircle />,
      url: `/`,
    },
  ];
  return sideMenus;
}
