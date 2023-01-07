import { StyledEngineProvider } from "@mui/material";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/globals.css";
import "../styles/taboo.css";

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
