import { Outlet } from "react-router-dom";
import GenericHeroLayout from "../../../shared/components/layout/GenericLayout";
import DashboardNav from "../../../shared/components/layout/DashboardNav";
import heroProvider from "../../../assets/images/hero-serv-prov.png";

const DashboardLayout = () => {
  return (
    <GenericHeroLayout
      backgroundImage={heroProvider}
      nav={<DashboardNav />}
      overlayClassName="bg-black/50 backdrop-blur-sm"
    >
      <Outlet />
    </GenericHeroLayout>
  );
};

export default DashboardLayout;
