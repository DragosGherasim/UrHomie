import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import MainNav from "../../components/layout/MainNav";

const HomeLayout = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 flex flex-col">
      <header className="relative h-16 bg-green-50/60 backdrop-blur-sm shadow-sm z-10">
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img
            src={logo}
            alt="UrHomie logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-lg font-bold text-green-700">UrHomie</span>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <MainNav role={role} />
              <button
                onClick={logout}
                className="border border-green-600 text-green-700 hover:bg-green-100 transition-all px-4 py-2 rounded-md font-semibold text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/landing")}
              className="border border-green-600 text-green-700 hover:bg-green-100 transition-all px-4 py-2 rounded-md font-semibold text-sm"
            >
              Join Us
            </button>
          )}
        </div>
      </header>

      <Outlet />
    </div>
  );
};

export default HomeLayout;
