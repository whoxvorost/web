import React from 'react';
import Header from "../../features/Header/Header";
import Footer from "../../features/Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
};

export default Layout;