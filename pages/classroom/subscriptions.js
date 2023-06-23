import React, { useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Layout from "../../layouts/schoolLayout";
import { GetUserCookie } from "../../service/user";
import { parseCookies } from "nookies";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../data/menubarsSubscription";
import { FcCheckmark } from "react-icons/fc";
import {
  CreateCheckout,
  CreateCheckoutOld,
} from "../../service/stripe-api/checkout";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
function Subscriptions({ user }) {
  const [sideMenus, setSideMenus] = useState();
  const tiers = [
    {
      title: `${
        user.language === "Thai"
          ? "สมาชิกฟรี"
          : user.language === "English" && "Free plan"
      }`,
      price: "0",
      description: [
        `${
          user.language === "Thai"
            ? "สร้างห้องเรียนได้ไม่เกิน 5 ห้อง"
            : user.language === "English" && "Only 5 classrooms can be created"
        }`,
        `${
          user.language === "Thai"
            ? "ใช้ระบบพื้นฐานได้เต็มที่"
            : user.language === "English" && "Can use all basic features"
        }`,
        `${
          user.language === "Thai"
            ? "สามารถเก็บงานได้อย่างไม่จำกัด"
            : user.language === "English" && "Unlimited storage"
        }`,
      ],
      buttonText: `${
        user.language === "Thai"
          ? "สมัครเลย"
          : user.language === "English" && "sign up"
      }`,
      buttonVariant: "outlined",
    },
    {
      title: `${
        user.language === "Thai"
          ? "สมาชิกเริ่มต้น"
          : user.language === "English" && "Tatuga starter"
      }`,
      subheader: "Most popular",
      price: "70",
      description: [
        `${
          user.language === "Thai"
            ? "สร้างห้องเรียนได้ไม่เกิน 20 ห้อง"
            : user.language === "English" && "Only 20 classrooms can be created"
        }`,
        `${
          user.language === "Thai"
            ? "ใช้ระบบพื้นฐานได้เต็มที่"
            : user.language === "English" && "Can use all basic features"
        }`,
        `${
          user.language === "Thai"
            ? "สามารถเก็บงานได้อย่างไม่จำกัด"
            : user.language === "English" && "Unlimited storage"
        }`,
        `${
          user.language === "Thai"
            ? "ใช้ premium feature ต่าง ๆ ในอนาคต"
            : user.language === "English" && "Access furture premium features"
        }`,
      ],
      buttonText: `${
        user.language === "Thai"
          ? "สมัครเลย"
          : user.language === "English" && "sign up"
      }`,
      buttonVariant: "contained",
    },
    {
      title: `${
        user.language === "Thai"
          ? "สมาชิกพรีเมี่ยม"
          : user.language === "English" && "Tatuga starter"
      }`,
      subheader: "Unlimited",
      price: "120",
      description: [
        `${
          user.language === "Thai"
            ? "สร้างห้องเรียนไม่จำกัด"
            : user.language === "English" && "create classroom unlimitedly"
        }`,
        `${
          user.language === "Thai"
            ? "ใช้ระบบพื้นฐานได้เต็มที่"
            : user.language === "English" && "Can use all basic features"
        }`,
        `${
          user.language === "Thai"
            ? "สามารถเก็บงานได้อย่างไม่จำกัด"
            : user.language === "English" && "Unlimited storage"
        }`,
        `${
          user.language === "Thai"
            ? "ใช้ premium feature ต่าง ๆ ในอนาคต"
            : user.language === "English" && "Access furture premium features"
        }`,
      ],
      buttonText: `${
        user.language === "Thai"
          ? "สมัครเลย"
          : user.language === "English" && "sign up"
      }`,
      buttonVariant: "contained",
    },
  ];
  useEffect(() => {
    setSideMenus(() => {
      if (user?.language === "Thai") {
        return sideMenusThai;
      } else if (user?.language === "English") {
        return sideMenusEnglish;
      }
    });
  }, []);

  const handleCreateCheckOutStarter = async () => {
    try {
      if (user.plan === "TATUGA-PREMIUM") {
        const url = await CreateCheckout({
          priceId: process.env.NEXT_PUBLIC_TATUGA_STARTER_PRICEID,
        });
        window.location.href = url.data;
      } else if (user.plan === "FREE") {
        const url = await CreateCheckout({
          priceId: process.env.NEXT_PUBLIC_TATUGA_STARTER_PRICEID,
        });
        window.location.href = url.data;
      }
    } catch (err) {}
  };

  const handleCreateCheckOutPremium = async () => {
    try {
      if (user.plan === "TATUGA-STARTER") {
        const url = await CreateCheckoutOld({
          priceId: process.env.NEXT_PUBLIC_TATUGA_PREMIUM_PRICEID,
        });
        window.location.href = url.data;
      } else if (user.plan === "FREE") {
        const url = await CreateCheckout({
          priceId: process.env.NEXT_PUBLIC_TATUGA_PREMIUM_PRICEID,
        });
        window.location.href = url.data;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-gradient-to-t h-full lg:h-full md:h-screen from-blue-300 to-orange-100">
      <Layout user={user} sideMenus={sideMenus}>
        <GlobalStyles
          styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
        />
        <CssBaseline />

        {/* Hero unit */}
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          className="w-full"
          sx={{ pt: 10, pb: 6 }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            className="font-Poppins font-bold  "
          >
            pricing
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            component=""
            className="flex justify-center"
          >
            <div className="w-3/4 md:w-full">
              {user.language === "Thai"
                ? "มาจัดการชั้นเรียนกับ tatuga class สะดวก สบาย และมีประสิทธิภาพ"
                : "Let's create you classroom with tatuga class!"}
            </div>
          </Typography>
        </Container>
        <section className="w-full flex flex-col items-center pb-10 md:flex-row md:gap-5  justify-center gap-10 font-Kanit">
          {tiers.map((tire, index) => {
            return (
              <div
                key={index}
                className={`w-max bg-white md:w-60 lg:w-max ring-2 ring-blue-500 rounded-xl md:p-2 lg:p-5 p-5 drop-shadow-md 
                ${
                  index === 1 || index === 2
                    ? "hover:scale-110 transition duration-100"
                    : ""
                }`}
              >
                <div className="w-full flex flex-col justify-center items-center">
                  <span
                    className={`lg:text-3xl md:text-xl font-bold ${
                      index === 0 ? "text-gray-500" : "text-blue-500"
                    } `}
                  >
                    {tire.title}
                  </span>
                  {tire.subheader && (
                    <span className="w-max text-sm md:text-xs h-max p-1 rounded-md text-white bg-orange-400">
                      {tire.subheader}
                    </span>
                  )}
                </div>
                <div className="flex justify-center mt-3 items-end">
                  <span className="font-bold lg:text-8xl md:text-3xl">
                    {tire.price}
                  </span>
                  บาท/เดือน
                </div>
                <ul className="pl-0 flex flex-col gap-2 mt-5">
                  {tire.description.map((description, index) => {
                    return (
                      <li key={index} className="flex gap-2 text-sm">
                        <div
                          className="lg:w-5 lg:h-5 md:w-3 md:h-3 bg-green-200 rounded-full 
                        flex justify-center items-center md:text-base  "
                        >
                          <FcCheckmark />
                        </div>
                        {description}
                      </li>
                    );
                  })}
                </ul>
                {(index === 1 || index === 2) && (
                  <div className="w-full flex justify-center ">
                    {user.plan === "TATUGA-STARTER" &&
                      user.subscriptions === "active" &&
                      index === 1 && (
                        <div className="mt-5 bg-gray-400 text-white px-10 py-3  transition duration-150 rounded-3xl">
                          {user.language === "Thai"
                            ? "คุณได้สมัครสมาชิกแล้ว"
                            : user.language === "English" &&
                              "You are already a memeber"}
                        </div>
                      )}
                    {user.plan === "TATUGA-STARTER" &&
                      user.subscriptions === "active" &&
                      index === 2 && (
                        <button
                          onClick={handleCreateCheckOutPremium}
                          className="mt-5 bg-blue-400 text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl"
                        >
                          {user.language === "Thai"
                            ? "ย้ายมาพรีเมี่ยม"
                            : user.language === "English" && "MOVE TO PREMIUM"}
                        </button>
                      )}
                    {user.plan === "TATUGA-PREMIUM" &&
                      user.subscriptions === "active" &&
                      index === 2 && (
                        <div className="mt-5 bg-gray-400 text-black md:px-3 md:text-sm px-10 py-3  transition duration-150 rounded-3xl">
                          {user.language === "Thai"
                            ? "คุณได้สมัครสมาชิกแล้ว"
                            : user.language === "English" &&
                              "You are already a memeber"}
                        </div>
                      )}
                    {user.plan === "TATUGA-PREMIUM" &&
                      user.subscriptions === "active" &&
                      index === 1 && (
                        <button
                          onClick={handleCreateCheckOutStarter}
                          className="mt-5 bg-blue-400 text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl"
                        >
                          {user.language === "Thai"
                            ? "ย้ายไปแผนเริ่มต้น"
                            : user.language === "English" && "MOVE TO STARTER"}
                        </button>
                      )}
                    {(user.plan === "FREE" ||
                      user.subscriptions !== "active") && (
                      <button
                        onClick={
                          index === 1
                            ? handleCreateCheckOutStarter
                            : index === 2 && handleCreateCheckOutPremium
                        }
                        className="mt-5 bg-blue-400 text-white px-10 py-3 hover:bg-orange-500 transition duration-150 rounded-3xl"
                      >
                        {user.language === "Thai"
                          ? "สมัครเลย"
                          : user.language === "English" && "register now"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
        {/* End hero unit */}

        {/* Footer */}
      </Layout>
      {/* End footer */}
    </div>
  );
}

export default Subscriptions;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: "unauthorized",
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  }
}
