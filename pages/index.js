import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import NodePanel from "../components/NodePanel";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
} from "reactflow";

import "reactflow/dist/style.css";
import {
  defaultEdgeOptions,
  initialEdges,
  initialNodes,
} from "../helper/constants";

export default function Home() {
  // initial states
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [variant, setVariant] = useState("dots");
  const [tasks, setTasks] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onDragStart = (evt) => {
    let element = evt.currentTarget;
    element.classList.add("dragged");
    evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = (evt) => {
    evt.currentTarget.classList.remove("dragged");
  };

  const onDragEnter = (evt) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add("dragged-over");
    evt.dataTransfer.dropEffect = "move";
  };

  const onDragLeave = (evt) => {
    let currentTarget = evt.currentTarget;
    let newTarget = evt.relatedTarget;
    if (newTarget.parentNode === currentTarget || newTarget === currentTarget)
      return;
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.remove("dragged-over");
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  const onDrop = (evt, value) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove("dragged-over");
    let data = evt.dataTransfer.getData("text/plain");
    const draggedTask = tasks.find((task) => task.id === data);
    const updatedTasks = tasks.filter((task) => task.id !== data);
    setTasks(updatedTasks);
    localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
    setNodes([
      ...nodes,
      {
        id: data,
        data: { label: draggedTask.title },
        position: { x: evt.screenX, y: evt.screenY },
      },
    ]);

    let lastEdge = edges.slice(-1);
    let lastNode = nodes.slice(-1);
    lastEdge = lastEdge?.length > 0 ? lastEdge[0] : {};
    lastNode = lastNode?.length > 0 ? lastNode[0] : {};
    if (lastEdge && lastNode) {
      onConnect({
        animated: true,
        sourceHandle: null,
        targetHandle: null,
        id: `e${lastEdge.target}-${data}`,
        source: lastNode.id,
        target: data,
      });
    }
  };

  const onSaveBuilder = () => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  // getting the nodes and edges from local storage
  useEffect(() => {
    const storedNodes = localStorage.getItem("nodes");
    const storedEdges = localStorage.getItem("edges");

    if (storedNodes) {
      const parseNodes = JSON.parse(storedNodes);
      setNodes(parseNodes || initialNodes);
    } else {
      setNodes(initialNodes);
    }

    if (storedEdges) {
      const parseEdges = JSON.parse(storedEdges);
      setEdges(parseEdges || initialEdges);
    } else {
      setEdges(initialEdges);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetFlow = () => {
    localStorage.clear();
    setNodes([]);
    setEdges([]);
    setTasks([]);
  };

  return (
    <div className="min-h-screen bg-sky-200">
      <Header onSave={onSaveBuilder} isSaved={isSaved} />
      <div className="grid grid-cols-5 mx-auto">
        <div className="col-span-4 relative">
          <div
            style={{ width: "100%", height: "90vh" }}
            onDragLeave={(e) => onDragLeave(e)}
            onDragEnter={(e) => onDragEnter(e)}
            onDragEnd={(e) => onDragEnd(e)}
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, false)}
          >
            <button
              className="bg-red-500/40 px-5 py-2 rounded-md absolute right-4 top-4 text-white font-bold z-50"
              onClick={resetFlow}
            >
              Reset flow
            </button>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              defaultEdgeOptions={defaultEdgeOptions}
            >
              <Controls />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
              <Background variant={variant} gap={12} size={1} />
              <Panel>
                <div className="flex gap-2 justify-between w-full">
                  <div className="flex gap-2">
                    {["Dots", "Lines", "Cross"].map((variant) => (
                      <button
                        key={variant}
                        className="bg-gray-100/40 px-5 py-2 rounded-md"
                        onClick={() => setVariant(variant.toLocaleLowerCase())}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>
        </div>
        <div className="col-span-1 p-4 border-l border-gray-100 min-h-screen shadow">
          <NodePanel
            tasks={tasks}
            setTasks={setTasks}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </div>
      </div>
    </div>
  );
}
