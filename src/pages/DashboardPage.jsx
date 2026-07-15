import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const DashboardPage = () => {

    return (
        <section className="dashboard-content">
            <Sidebar />
            <div className="dashboard-content-container">
                <Outlet />
            </div>
        </section>
    );
};

export default DashboardPage;