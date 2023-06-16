export const initialNodes = [
  {
    id: "1",
    data: { label: "World" },
    position: { x: 100, y: 100 },
  },
];

export const initialEdges = [];
export const defaultEdgeOptions = { animated: true };

export const getInitialTasks = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("Tasks") || `[]`);
  }

  return [];
};
