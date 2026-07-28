import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardPage = () => {

    return (
        <section className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 p-8">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default DashboardPage;