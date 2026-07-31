import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";

const DashboardPage = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <section className="min-h-screen bg-background flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <div className="flex-1 p-8">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default DashboardPage;