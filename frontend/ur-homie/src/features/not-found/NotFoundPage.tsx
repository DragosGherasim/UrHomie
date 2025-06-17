import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/hero-not-found.png";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4">
        <div className="bg-white/90 backdrop-blur-md px-6 py-10 rounded-xl shadow-lg text-center max-w-lg space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">
            404 - Page Not Found
          </h1>
          <p className="text-gray-700">
            We're sorry, but the page you were looking for doesn't exist.
          </p>

          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm font-medium"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;