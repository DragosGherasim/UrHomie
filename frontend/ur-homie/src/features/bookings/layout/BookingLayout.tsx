import { Outlet } from "react-router-dom";
import GenericHeroLayout from "../../../shared/components/layout/GenericLayout";
import HomeNav from "../../../shared/components/layout/HomeNav";
import { useAuth } from "../../../shared/context/AuthContext";
import heroClient from "../../../assets/images/hero-client.png";

const BookingLayout = () => {
  const { role } = useAuth();

  return (
    <GenericHeroLayout
      backgroundImage={heroClient}
      nav={<HomeNav role={role} />}
      overlayClassName="bg-black/30 backdrop-blur-sm"
    >
      <Outlet />
    </GenericHeroLayout>
  );
};

export default BookingLayout;
