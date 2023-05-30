import { useRouter } from "next/router";
import { FiArrowLeftCircle } from "react-icons/fi";
import React from "react";

export function SideMenusThai() {
  const router = useRouter();
  const sideMenusThai = [
    {
      title: "โรงเรียน",
      icon: "🏫",
      url: `/classroom/teacher`,
    },
    {
      title: "ห้องเรียน",
      icon: "👨‍🏫",
      url: `#`,
    },
    {
      title: "มอบหมายงาน",
      icon: "🎒",
      url: `/classroom/teacher/${router.query.classroomId}/assignment`,
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
  return sideMenusThai;
}

export function sideMenusEnglish() {
  const router = useRouter();
  const sideMenusEnglish = [
    {
      title: "school",
      icon: "🏫",
      url: `/classroom/teacher`,
    },
    {
      title: "classroom",
      icon: "👨‍🏫",
      url: `#`,
    },
    {
      title: "assignments",
      icon: "🎒",
      url: `/classroom/teacher/${router.query.classroomId}/assignment`,
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
  return sideMenusEnglish;
}
