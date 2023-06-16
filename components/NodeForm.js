const NodeForm = (props) => {
  return (
    <div className="TodoForm-container">
      <form className="TodoForm" onSubmit={props.onSubmit}>
        <input
          className="py-3 px-2 w-full rounded-md focus:ring-0 focus:border-none focus:outline-none"
          type="text"
          placeholder="Add a message..."
          value={props.value}
          onChange={props.onChange}
          maxLength="40"
          ref={props.reference}
          required
        />
        <div className="flex gap-2 my-3 justify-start">
          <button className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md text-sm" type="submit">
            {!props.isEditing ? "Add Message" : "Edit Message"}
          </button>
          <button className="border border-blue-500 text-blue-500 px-3 py-2 rounded-md text-sm" type="button" onFocus={props.onClick}>
            {!props.isEditing ? "Clear Message" : "Cancel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NodeForm;
