import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { type AppPropsWithLayout, type NextPageWithLayout } from "@/layouts";
import { api } from "@/utils/api";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { type NextComponentType, type NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const theme = createTheme({
  components: {
    AppShell: {
      styles: {
        main: {
          width: "100%",
        },
      },
    },
  },
  cursorType: "pointer",
});

const SessionWrapper: React.FC<{
  Component: NextComponentType<NextPageContext, object, object> &
    NextPageWithLayout<object, object>;
  pageProps: object;
}> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return <>{getLayout(<Component {...pageProps} />)}</>;
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  return (
    <>
      <Head>
        <title>
          Kartu Pengawas Keuangan | Direktorat Jenderal Informasi dan Diplomasi
          Publik
        </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <MantineProvider theme={theme}>
        <Notifications position="top-center" />
        <SessionProvider session={session}>
          <SessionWrapper Component={Component} pageProps={pageProps} />
        </SessionProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
