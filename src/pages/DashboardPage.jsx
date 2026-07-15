import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardPage = () => {

    return (
        <section className="dashboard-content">
            <Header />
            <Sidebar />
            <div className="dashboard-content-container">
                <Outlet />
            </div>
        </section>
    );
};

export default DashboardPage;