import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Homepage from "./pages/public/home";
import LoginPage from "./pages/public/login";
import RegisterPage from "./pages/public/register";

import { Toaster } from "react-hot-toast";
import UserDashboardPage from "./pages/private/user/dashboard";
import OwnerDashboardPage from "./pages/private/owner/dashboard/page";

import PrivateLayout from "./private-layout";
import PublicLayout from "./public-layout";
import OwnerProfilePage from "./pages/private/owner/profile";
import UserProfilePage from "./pages/private/user/profile";
import OwnerSalonsPage from "./pages/private/owner/salons";
import AddSalonPage from "./pages/private/owner/add-salon";
import EditSalonPage from "./pages/private/owner/edit-salon";
import UserSalonsPage from "./pages/private/user/salons/page";
import BookAppointmentPage from "./pages/private/user/book-appointment/page";
import UserAppointmentsPage from "./pages/private/user/appointments";
import SalonOwnerAppointments from "./pages/private/owner/appointments";
import Customers from "./pages/private/owner/customers/page";


function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Define your public routes here */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Homepage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />

          {/* Define your private routes here */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateLayout>
                <UserDashboardPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/user/profile"
            element={
              <PrivateLayout>
                <UserProfilePage />
              </PrivateLayout>
            }
          />
          <Route
            path="/user/salons"
            element={
              <PrivateLayout>
                <UserSalonsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/salons/book-appointment/:id"
            element={
              <PrivateLayout>
                <BookAppointmentPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/user/appointments"
            element={
              <PrivateLayout>
                <UserAppointmentsPage />
              </PrivateLayout>
            }
          />

          {/* Owner routes */}

          <Route
            path="/owner/dashboard"
            element={
              <PrivateLayout>
                <OwnerDashboardPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/owner/profile"
            element={
              <PrivateLayout>
                <OwnerProfilePage />
              </PrivateLayout>
            }
          />
          <Route
            path="/owner/salons"
            element={
              <PrivateLayout>
                <OwnerSalonsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/owner/salons/add"
            element={
              <PrivateLayout>
                <AddSalonPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/owner/salons/edit/:id"
            element={
              <PrivateLayout>
                <EditSalonPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/owner/appointments"
            element={
              <PrivateLayout>
                <SalonOwnerAppointments />
              </PrivateLayout>
            }
          />

          <Route
            path="/owner/customers"
            element={
              <PrivateLayout>
                <Customers />
              </PrivateLayout>
            }
          />
          
          {/* Catch-all route for 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <h1>404 Not Found</h1>
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
