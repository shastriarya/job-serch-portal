const InternshipCard = ({ data }) => {
  return (
    <div className="border p-4">
      <h3>{data.title}</h3>
      <p>{data.company}</p>
      <p>Duration: {data.duration}</p>
    </div>
  );
};

export default InternshipCard;