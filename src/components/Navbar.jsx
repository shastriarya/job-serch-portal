import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <h1 className="font-bold">JobAI Platform</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/internships">Internships</Link>
        <Link to="/dashboard">Dashboard</Link>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;