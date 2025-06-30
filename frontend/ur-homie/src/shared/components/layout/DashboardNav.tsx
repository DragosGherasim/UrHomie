import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "underline text-green-700 font-semibold" : "hover:text-green-500";

const DashboardNav = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-16 flex items-center justify-center px-6">
      <div
        className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={logo} alt="UrHomie logo" className="w-8 h-8 object-contain" />
        <span className="text-lg font-bold text-green-700">UrHomie</span>
      </div>

      <div className="flex gap-10 text-sm font-medium text-gray-700">
        <NavLink to="/dashboard/my-services" className={getLinkClass}>
          My Services
        </NavLink>
        <NavLink to="/dashboard/my-requests" className={getLinkClass}>
          My Requests
        </NavLink>
        <NavLink to="/dashboard/add-service" className={getLinkClass}>
          Add
        </NavLink>
      </div>
    </div>
  );
};

export default DashboardNav;
