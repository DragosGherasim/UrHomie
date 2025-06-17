import { Outlet } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import HomeNav from "../../../shared/components/layout/HomeNav";
import GenericHeroLayout from "../../../shared/components/layout/GenericLayout";
import heroClient from "../../../assets/images/hero-client.png";
import heroProvider from "../../../assets/images/hero-serv-prov.png";

const HomeLayout = () => {
  const { role } = useAuth();
  const backgroundImage = role === "client" ? heroClient : heroProvider;

  return (
    <GenericHeroLayout
      backgroundImage={backgroundImage}
      nav={<HomeNav role={role} />}
    >
      <Outlet />
    </GenericHeroLayout>
  );
};

export default HomeLayout;