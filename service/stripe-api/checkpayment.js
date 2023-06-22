import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function CheckPayment({ sessionId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const checkPayment = await axios.post(
      `${process.env.Server_Url}/stripe/check-payment`,
      {},
      {
        params: {
          sessionId: sessionId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return checkPayment;
  } catch (err) {
    throw new Error(err);
  }
}
