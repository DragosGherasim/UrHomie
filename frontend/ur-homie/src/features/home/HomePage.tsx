import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import heroImage from "../../assets/images/hero.png";
import { useState } from "react";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (!isAuthenticated) navigate("/landing");
  };

  return (
    <section
      className="flex items-center justify-center bg-no-repeat bg-cover bg-top"
      style={{ backgroundImage: `url(${heroImage})`, height: "calc(100vh - 64px)" }}
    >
      <div className="text-center bg-black/40 px-8 py-10 rounded-lg max-w-2xl text-white w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Your service providers will take it from here
        </h1>
        <div className="flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search services, providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-l-md focus:outline-none text-gray-800"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-r-md text-white"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;