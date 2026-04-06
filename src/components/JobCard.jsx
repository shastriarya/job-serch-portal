import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="border p-4 shadow">
      <h2 className="font-bold">{job.title}</h2>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <Link to={`/jobs/${job._id}`} className="text-blue-500">
        View Details
      </Link>
    </div>
  );
};

export default JobCard;