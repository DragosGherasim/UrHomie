import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";

interface HomeNavProps {
  role: "client" | "service_provider" | null;
}

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "underline text-green-700" : "hover:text-green-500";

const HomeNav: React.FC<HomeNavProps> = ({ role }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full h-16 flex items-center justify-between px-6">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/home")}
      >
        <img src={logo} alt="UrHomie logo" className="w-8 h-8 object-contain" />
        <span className="text-lg font-bold text-green-700">UrHomie</span>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
        <NavLink to="/profile" className={getLinkClass}>
          Profile
        </NavLink>
        <NavLink to="/dashboard/requests" className={getLinkClass}>
          Requests
        </NavLink>
        {role === "service_provider" && (
          <>
            <NavLink to="/dashboard/services" className={getLinkClass}>
              Services
            </NavLink>
            <NavLink to="/dashboard/add-service" className={getLinkClass}>
              Add
            </NavLink>
          </>
        )}

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="border border-green-600 text-green-700 hover:bg-green-100 transition-all px-4 py-2 rounded-md font-semibold text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/landing")}
            className="border border-green-600 text-green-700 hover:bg-green-100 transition-all px-4 py-2 rounded-md font-semibold text-sm"
          >
            Join Us
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeNav;