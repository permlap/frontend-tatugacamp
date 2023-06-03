import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function DownloadExcelAttendance({
  classroomId,
  absent,
  present,
  holiday,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    axios
      .post(
        `${process.env.Server_Url}/excel/download/attendance`,
        {
          absent,
          present,
          holiday,
        },
        {
          params: {
            classroomId: classroomId,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "blob", // to receive binary data
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "attendance.xlsx"); // set the filename for download
        document.body.appendChild(link);
        link.click();
      });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DownloadExcelScore({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    axios
      .get(`${process.env.Server_Url}/excel/download/scores`, {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseType: "blob", // to receive binary data
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "scores.xlsx"); // set the filename for download
        document.body.appendChild(link);
        link.click();
      });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
