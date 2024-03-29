import React from 'react';
// import ReactDOM from 'react-dom';
import App from 'next/app';
import Head from 'next/head';
// import Router from 'next/router';

// import PageChange from 'components/PageChange/PageChange.js';

import { SnackbarProvider } from 'notistack';
import 'assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'assets/scss/nextjs-argon-dashboard.scss';

// Router.events.on('routeChangeStart', (url) => {
//   document.body.classList.add('body-page-transition');
//   ReactDOM.render(
//     <PageChange path={url} />,
//     document.getElementById('page-transition')
//   );
// });
// Router.events.on('routeChangeComplete', () => {
//   ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
//   document.body.classList.remove('body-page-transition');
// });
// Router.events.on('routeChangeError', () => {
//   ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
//   document.body.classList.remove('body-page-transition');
// });

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <SnackbarProvider maxSnack={3}>
        <React.Fragment>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
            />
            <title>Analisis Sentimen</title>
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </React.Fragment>
      </SnackbarProvider>
    );
  }
}
