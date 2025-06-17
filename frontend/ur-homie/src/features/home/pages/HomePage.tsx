import { useAuth } from "../../../shared/context/AuthContext";
import ClientHome from "./ClientHomePage";
import ServiceProviderHome from "./ServiceProviderHomePage";

const HomePage = () => {
  const { role } = useAuth();

  if (role === "service_provider") {
    return <ServiceProviderHome />;
  }

  return <ClientHome />;
};

export default HomePage;
