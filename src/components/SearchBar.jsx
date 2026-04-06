const SearchBar = ({ setQuery }) => {
  return (
    <input
      className="border p-2 w-full"
      placeholder="Search jobs..."
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default SearchBar;