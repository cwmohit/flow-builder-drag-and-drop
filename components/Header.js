const Header = ({ onSave, isSaved }) => {
  return (
    <div className="bg-gray-200 py-4 px-2 flex justify-between items-center">
      <h1 className="px-2 text-2xl font-bold font-sans text-blue-500/70 -tracking-tighter">
        Chatbot builder
      </h1>
      <button
        className="border border-blue-500 text-blue-500 px-3 mx-2 py-2 rounded-md"
        onClick={onSave}
      >
        {isSaved ? "Saved" : "Save Changes"}
      </button>
    </div>
  );
};

export default Header;
