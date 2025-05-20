import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";

const HomeLayout = () => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 flex flex-col">
      <header className="w-full h-16 bg-green-50/60 backdrop-blur-sm shadow-sm flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <img src={logo} alt="UrHomie logo" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold text-green-700">UrHomie</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <nav className="flex gap-6 text-sm font-medium text-gray-700 items-center">
                <NavLink
                  to="/home/profile"
                  className={({ isActive }) =>
                    isActive ? "underline text-green-700" : "hover:text-green-500"
                  }
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/home/requests"
                  className={({ isActive }) =>
                    isActive ? "underline text-green-700" : "hover:text-green-500"
                  }
                >
                  Requests
                </NavLink>
                {role === "service_provider" && (
                  <>
                    <NavLink
                      to="/home/services"
                      className={({ isActive }) =>
                        isActive ? "underline text-green-700" : "hover:text-green-500"
                      }
                    >
                      Services
                    </NavLink>
                    <NavLink
                      to="/home/add"
                      className={({ isActive }) =>
                        isActive ? "underline text-green-700" : "hover:text-green-500"
                      }
                    >
                      Add
                    </NavLink>
                  </>
                )}
              </nav>

              <button
                onClick={logout}
                className="border border-green-600 text-green-700 hover:bg-green-100 transition-all px-4 py-2 rounded-md font-semibold text-sm"
              >
                Logout
              </button>
            </div>
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
