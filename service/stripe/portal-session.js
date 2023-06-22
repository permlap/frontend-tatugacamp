import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function ProtalSession() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const createPortalSession = await axios.post(
      `${process.env.Server_Url}/stripe/create-portal-session`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return createPortalSession;
  } catch (err) {
    throw new Error(err);
  }
}
