import { useAuth } from "../../context/AuthContext";
import ClientHome from "./ClientHome";
import ServiceProviderHome from "./ServiceProviderHome";

const HomePage = () => {
  const { role } = useAuth();

  if (role === "service_provider") {
    return <ServiceProviderHome />;
  }

  return <ClientHome />;
};

export default HomePage;
