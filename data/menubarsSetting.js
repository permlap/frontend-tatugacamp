import { FiSettings, FiArrowLeftCircle } from "react-icons/fi";
export const sideMenusThai = [
  {
    title: "โรงเรียน",
    icon: "🏫",
    url: "/classroom/teacher",
  },

  {
    title: "ตั้งค่า",
    icon: <FiSettings />,
    url: "/classroom/setting",
  },
  {
    title: "หน้าหลัก",
    icon: <FiArrowLeftCircle />,
    url: "/",
  },
];

export const sideMenusEng = [
  {
    title: "school",
    icon: "🏫",
    url: "/classroom/teacher",
  },

  {
    title: "setting",
    icon: <FiSettings />,
    url: "/classroom/setting",
  },
  {
    title: "homepage",
    icon: <FiArrowLeftCircle />,
    url: "/",
  },
];
