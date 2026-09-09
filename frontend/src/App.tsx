import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/home";
import UserPage from "./pages/user";
import CreateUserPage from "./pages/user/add";
import UsersPage from "./pages/users";


export default function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* User Routes */}
        <Route path='/users' element={<UsersPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path='/user/add' element={<CreateUserPage />} />
      </Routes>
    </div>
  );
}