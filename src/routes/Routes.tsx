import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Auth/Login";
import AuthLayout from "../components/layouts/AuthLayout";
import Signup from "../pages/Auth/Signup";
import HomeLayout from "../components/layouts/HomeLayout";
import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import About from "../pages/About/About";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/layouts/AdminLayout";
import Admin from "../pages/Admin/Admin";
import DonationTypes from "../pages/Admin/DonationTypes";
import Donors from "../pages/Admin/Donors";
import Donations from "../pages/Admin/Donations";
import PrivateRoute from "./PrivateRoute";
import UserDonationForm from "../pages/UserDonations/UserDonationForm";
import UserDonations from "../pages/UserDonations/UserDonations";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout width="44rem">
        <Signup />
      </AuthLayout>
    ),
  },
  {
    path: "/",
    element: (
      <HomeLayout>
        <Home />
      </HomeLayout>
    ),
  },
  {
    path: "/contact-us",
    element: (
      <HomeLayout>
        <Contact />
      </HomeLayout>
    ),
  },
  {
    path: "/about-us",
    element: (
      <HomeLayout>
        <About />
      </HomeLayout>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <Admin />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: "/donation-types",
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <DonationTypes />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: "/donors",
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <Donors />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: "/donations",
    element: (
      <AdminRoute
        element={
          <AdminLayout>
            <Donations />
          </AdminLayout>
        }
      />
    ),
  },
  {
    path: "/user-donate",
    element: (
      <PrivateRoute
        element={
          <HomeLayout>
            <UserDonationForm />
          </HomeLayout>
        }
      />
    ),
  },
  {
    path: "/user-donations",
    element: (
      <PrivateRoute
        element={
          <HomeLayout>
            <UserDonations />
          </HomeLayout>
        }
      />
    ),
  },
  {
    path: "/user-donate/update/:id",
    element: (
      <PrivateRoute
        element={
          <HomeLayout>
            <UserDonationForm />
          </HomeLayout>
        }
      />
    ),
  },
]);
