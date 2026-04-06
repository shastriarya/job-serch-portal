import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        AI Powered Job & Internship Platform
      </h1>
      <p className="mt-4">Find jobs, internships, and career guidance.</p>

      <div className="mt-6 flex gap-4">
        <Link to="/jobs" className="bg-blue-500 text-white p-2">
          Explore Jobs
        </Link>
        <Link to="/internships" className="bg-green-500 text-white p-2">
          Explore Internships
        </Link>
      </div>
    </div>
  );
};

export default Home;