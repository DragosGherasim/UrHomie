import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import banner from "../../assets/images/landing_banner.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="flex w-full max-w-5xl h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-[55%] bg-green-100 flex flex-col items-center justify-center p-10">
          <div className="flex flex-col items-center gap-6">
            <img
              src={logo}
              alt="UrHomie Logo"
              className="h-28 w-28 object-contain"
            />

            <h1 className="text-3xl font-bold text-green-700 text-center">
              Welcome to UrHomie
            </h1>
            <p className="text-green-600 text-center max-w-xs">
              Your trusted home maintenance partner
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-white text-green-600 border border-green-400 hover:bg-gray-100 font-semibold py-2 px-6 rounded-lg transition"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>

        <div className="w-[45%] flex items-center justify-center p-8">
          <img
            src={banner}
            alt="Home maintenance banner"
            className="rounded-lg shadow-md object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
