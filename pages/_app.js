import { StyledEngineProvider } from "@mui/material";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  return (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />

        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
      </QueryClientProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
