import axios from "axios";
import Error from "next/error";

export async function UploadProfilePicture(formData) {
  try {
    const access_token = localStorage.getItem("access_token");
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
