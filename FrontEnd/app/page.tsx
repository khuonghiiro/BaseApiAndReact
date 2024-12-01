"use client";
import "../public/assets/css/styles.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BannerSearch from "./components/frontend/banner-search";
// import ContentHome from './components/frontend/content-home';
import HeaderTop from "./components/frontend/header-top";
import Footer from "./components/frontend/footer";
import Page from "./login/page";

export default function Home() {
  return (
    <>
      <main className="main">
        {/* <HeaderTop />
        <BannerSearch />

        <Footer /> */}
        {/* <ContentHome /> */}
        <Page />
      </main>
    </>
  );
}
