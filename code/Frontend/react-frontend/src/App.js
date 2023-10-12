import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages";
import Items from "./pages/AddItem";
import Contact from "./pages/contact";

//import CheckoutHelp from "./pages/form_helpbutton";
import Checkout from "./pages/payment_validation";
import PaymentSuccessful from "./pages/payment_successful";

import { useUser } from "./Components/UserContext";

import ItemSearchAndFilter from "./pages/search";
import Info from "./pages/info";
import Reservations from "./pages/MakeReservation";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import View from "./pages/ViewItem";
import Profile from "./pages/profile";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserProfile from "./Components/UserProfile";
import { Navigate } from "react-router-dom";

function App() {
  const { username, userType } = useUser();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="" element={<ItemSearchAndFilter />} />
          <Route path="contact" element={<Contact />} />
          <Route path="PaymentSuccessful" element={<PaymentSuccessful />} />

          <Route
            path="Items"
            element={
              <ProtectedRoute>
                {userType === "host" ? <Items /> : <Navigate to="/" />}
              </ProtectedRoute>
            }
          />
          <Route
            path="Checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="View"
            element={
              <ProtectedRoute>
                <View />
              </ProtectedRoute>
            }
          />
          <Route
            path="reservations"
            element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="AllProfile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="AllProfile/user/:usernameSelected"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="info" element={<Info />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
