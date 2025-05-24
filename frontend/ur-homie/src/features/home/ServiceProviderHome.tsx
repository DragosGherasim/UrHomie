import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/hero-serv-prov.png";

// Dummy services 
const services = [
  { id: 1, name: "Plumbing Repair" },
  { id: 2, name: "House Cleaning" },
  { id: 3, name: "Electrical Installations" },
  { id: 4, name: "Painting Services" },
  { id: 5, name: "Furniture Assembly" },
];

const ServiceCard = ({ name }: { name: string }) => (
  <div className="bg-white/90 backdrop-blur p-4 rounded shadow hover:shadow-md transition">
    <h3 className="text-md font-semibold text-green-700 truncate">{name}</h3>
  </div>
);

const ServiceProviderHome = () => {
  const navigate = useNavigate();
  const topServices = services.slice(0, 5); 

  return (
    <section
  className="min-h-[calc(100vh-64px)] bg-[length:100%] bg-no-repeat bg-[center_35%] flex items-center justify-center px-6 py-10"
  style={{ backgroundImage: `url(${heroImage})` }}
>

      <div className="max-w-6xl w-full text-white">
        <div className="bg-black/50 p-6 md:p-10 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Manage your services with ease
              </h1>
              <p className="text-green-100 text-sm">
                Here's a quick snapshot of your active listings.
              </p>
            </div>
            <button
              onClick={() => navigate("/home/add")}
              className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium"
            >
              + Add New Service
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topServices.map((service) => (
              <ServiceCard key={service.id} name={service.name} />
            ))}
          </div>

          <div className="text-right mt-4">
            <button
              onClick={() => navigate("/home/services")}
              className="text-sm text-green-300 hover:text-white underline"
            >
              View all services →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProviderHome;
