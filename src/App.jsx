import { Routes, Route } from 'react-router-dom';
import Layout from './components/UI/Layout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CountryList from './pages/CountryList';
import CountryDetails from './pages/CountryDetails';
import Favourite from './pages/Favourite';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="countries-list" element={<CountryList />} />
        <Route path="country/:cca3" element={<CountryDetails />} />
        <Route path="favourite" element={<Favourite />} />
        <Route path="forgot-password" element={<div>Forgot Password Page (TBD)</div>} />
      </Route>
    </Routes>
  );
}

export default App;