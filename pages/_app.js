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
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <Script id="facebook" strategy="lazyOnload">
        {`
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "107002408742438");
      chatbox.setAttribute("attribution", "biz_inbox");

      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v12.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
  `}
      </Script>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />

        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
      </QueryClientProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
