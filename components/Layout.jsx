import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children, title = 'Next' }) {
  return (
    <div className="site-wrapper">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.png" />
        <Header />
      </Head>
      <main className="site-main inner-width">
        {title && <h1>{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
