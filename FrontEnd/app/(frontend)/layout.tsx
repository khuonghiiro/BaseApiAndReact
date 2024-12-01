'use client';
// import "./styles/styles.css";
import { useState, useEffect } from "react";
import '../../public/assets/css/styles.css'
import HeaderTop from '../components/frontend/header-top'
import Footer from '../components/frontend/footer';
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>

            <main className="main">
                <HeaderTop />

                {children}

                <Footer />
            </main>

        </>
    );
}
