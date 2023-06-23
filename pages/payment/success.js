import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import * as SuccesfulAnimation from "../../components/79952-successful.json";
import { useRouter } from "next/router";
import Loading from "../../components/loading/loading";
import { CheckPayment } from "../../service/stripe-api/checkpayment";
import Head from "next/head";

function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [url, setUrl] = useState();
  const [loadingPayment, setLoadingPayment] = useState(true);
  const style = {
    height: 300,
  };
  const handlecheckPayment = async (session_id) => {
    try {
      const url = await CheckPayment({ sessionId: session_id });
      setUrl(() => url.data);
      setLoadingPayment(() => false);
    } catch (err) {
      setLoadingPayment(() => false);
      console.log(err);
    }
  };
  useEffect(() => {
    if (session_id) {
      handlecheckPayment(session_id);
    }
  }, [session_id]);

  return (
    <div className="w-screen flex justify-center items-center h-screen bg-green-500">
      <Head>
        <title>check payment</title>
      </Head>
      <div className="w-10/12 h-max md:w-6/12 lg:w-5/12 bg-white rounded-2xl p-5 flex flex-col items-center justify-center  text-center drop-shadow-xl font-Poppins ">
        {loadingPayment ? (
          <div className="flex flex-col justify-center items-center">
            <span>please wait...</span>
            <Loading />
          </div>
        ) : (
          <div>
            <span className="font-semibold text-xl text-green-500">
              Payment success
            </span>
            <Lottie animationData={SuccesfulAnimation} style={style} />
            <div className="w-full flex gap-5 justify-center">
              <button
                onClick={() =>
                  router.push({
                    pathname: "/classroom/teacher",
                  })
                }
                className="bg-blue-500 font-semibold text-white p-3 rounded-lg hover:scale-110 transition duration-150"
              >
                home
              </button>
              <button
                onClick={() => {
                  window.location.href = url;
                }}
                className="bg-green-500 font-semibold text-white p-3 rounded-lg hover:scale-110 transition duration-150"
              >
                check payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Success;
