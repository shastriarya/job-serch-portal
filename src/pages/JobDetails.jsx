import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1>Job Details ID: {id}</h1>
      <button className="bg-blue-500 text-white p-2 mt-4">
        Apply Now
      </button>
    </div>
  );
};

export default JobDetails;