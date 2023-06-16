const NodeList = (props) => {
  return (
    <div className="TodoList-container">
      <ul className="flex flex-col gap-3">{props.children}</ul>
    </div>
  );
};

export default NodeList;