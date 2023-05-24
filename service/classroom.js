import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function CreateClassroom(inputObject) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.post(
      `${process.env.Server_Url}/user/classroom/create`,
      {
        title: inputObject.title,
        description: inputObject.description,
        level: inputObject.level,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  } catch (err) {
    console.log("err from service", err);
    throw new Error(err);
  }
}

export async function DeleteClassroom(classroomId) {
  const cookies = parseCookies();
  const access_token = cookies.access_token;
  try {
    const deleteClassroom = await axios.delete(
      `${process.env.Server_Url}/user/classroom/delete`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return deleteClassroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllClassrooms() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classrooms = await axios.get(
      `${process.env.Server_Url}/user/classroom/get-all-classroom`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classrooms;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetOneClassroom({ params }) {
  try {
    if (!params) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/classroom/get-a-classroom/${params}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateClassroom({ classroomState }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.Server_Url}/user/classroom/update`,
      {
        title: classroomState.title,
        level: classroomState.level,
        description: classroomState.description,
      },
      {
        params: {
          classroomId: classroomState.id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}
