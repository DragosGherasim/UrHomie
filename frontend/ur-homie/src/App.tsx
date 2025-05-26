import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
      <div className="App">
        <AppRoutes />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
  );
}

export default App;
