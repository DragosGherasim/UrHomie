import { NavLink } from "react-router-dom";

interface MainNavProps {
  role: "client" | "service_provider" | null;
}

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "underline text-green-700" : "hover:text-green-500";

const MainNav: React.FC<MainNavProps> = ({ role }) => {
  return (
    <nav className="flex gap-6 text-sm font-medium text-gray-700 items-center">
      <NavLink to="/home/profile" className={getLinkClass}>
        Profile
      </NavLink>
      <NavLink to="/home/requests" className={getLinkClass}>
        Requests
      </NavLink>
      {role === "service_provider" && (
        <>
          <NavLink to="/home/services" className={getLinkClass}>
            Services
          </NavLink>
          <NavLink to="/home/add" className={getLinkClass}>
            Add
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default MainNav;
