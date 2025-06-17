import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../features/landing/LandingPage";
import LoginForm from "../features/auth/forms/LoginForm";
import GeneralInformationsForm from "../features/auth/forms/GeneralInformationsForm";
import ServiceProviderDetailsForm from "../features/auth/forms/ServiceProviderDetailsForm";
import ProfilePage from "../features/profile/pages/ProfilePage";
import HomePage from "../features/home/pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import HomeLayout from "../features/home/layout/HomeLayout";

import AddServiceForm from "../features/dashboard/provided-services/forms/AddServiceForm";
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import MyServicesPage from "../features/dashboard/provided-services/pages/MyServicesPage";
import ServiceDetailsPage from "../features/dashboard/provided-services/pages/ServiceDetailsPage";
import NotFoundPage from "../features/not-found/NotFoundPage";
import SearchResultsPage from "../features/search/SearchResultsPage";

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
      </Route>

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="service_provider">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="add-service" element={<AddServiceForm />} />
        <Route path="services" element={<MyServicesPage />} />
      </Route>

      <Route
        path="/services/:id"
        element={
          <ProtectedRoute>
            <ServiceDetailsPage />
          </ProtectedRoute>
        }
      ></Route>

      <Route path="/not-found" element={<NotFoundPage />} />

      <Route path="*" element={<Navigate to="/not-found" replace />} />

      <Route
        path="/home/search"
        element={
          <ProtectedRoute allowedRole="client">
            <SearchResultsPage />
          </ProtectedRoute>
        }
      ></Route>
    </Routes>
  );
};

export default AppRoutes;
