import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../features/landing/LandingPage";
import LoginForm from "../features/auth/LoginForm";
import GeneralInformationsForm from "../features/auth/GeneralInformationsForm";
import ServiceProviderDetailsForm from "../features/auth/ServiceProviderDetailsForm";
import ProfilePage from "../features/profile/ProfilePage";
import HomePage from "../features/home/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import HomeLayout from "../features/home/HomeLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<GeneralInformationsForm />} />
      <Route
        path="/register/service-provider"
        element={<ServiceProviderDetailsForm />}
      />

<Route path="/home" element={<HomeLayout />}>
  <Route index element={<HomePage />} />
  <Route
    path="profile"
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />
</Route>

    </Routes>
  );
};

export default AppRoutes;
