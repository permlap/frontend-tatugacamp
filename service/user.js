import axios from "axios";
import Error from "next/error";

export async function GetUser() {
  try {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      throw new Error("Unauthorized");
    }
    const user = await axios.get(`${process.env.Server_Url}/users/me`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    return user;
  } catch (err) {
    if (err.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw new Error(err);
    }
  }
}

export async function UploadProfilePicture({ formData }) {
  try {
    console.log(formData);
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      throw new Error("Unauthorized");
    }
    const profile = await axios.post(
      `${process.env.Server_Url}/users/upload`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(profile);
    return profile;
  } catch (error) {
    throw new Error(error);
  }
}

export async function UpdateUserData(updateddata) {
  try {
    const access_token = localStorage.getItem("access_token");

    const updateData = await axios.put(
      `${process.env.Server_Url}/users/update-user`,
      {
        firstName: updateddata.firstName,
        lastName: updateddata.lastName,
        school: updateddata.school,
        phone: updateddata.phone,
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return updateData;
  } catch (err) {
    throw new Error(err);
  }
}
