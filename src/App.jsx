import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CountryList from "./pages/CountryList";
import CountryDetails from "./pages/CountryDetails";
import Favourite from "./pages/Favourite";
import Layout from "./components/UI/Layout";
import { CountryProvider } from "./context/CountryContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CountryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="countries-list" element={<CountryList />} />
                <Route path="country/:cca3" element={<CountryDetails />} />
                <Route path="favourite" element={<Favourite />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CountryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;