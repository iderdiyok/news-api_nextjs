import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children, title }) {
  return (
    <div className="site-wrapper">
      <Head>
        {title && <title>{title}</title>}
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <main className="site-main inner-width">
        {title && <h1>{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
