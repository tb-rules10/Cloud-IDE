import { useEffect, useState } from "react"
import Terminal from "./components/Terminal"
import FileTree from "./components/FileTree";
import socket from "./socket";
import Editor from "./components/Editor";


function App() {

  const [fileTree, setFileTree] = useState(null);
  
  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const res = await response.json();
    setFileTree(res.tree);
  };

  useEffect(() => {
    getFileTree();
  }, [])

  useEffect(() => {
    socket.on('file-refresh', getFileTree) 
    return () => {
      socket.off('file-refresh');
    };
  }, [])

  return (
    <>
      <div id="playground" className="flex flex-col h-screen ">
        <div id="editor-cont" className="min-h-[50vh] flex flex-row w-screen bg-red-500 flex-grow">
          <div id="files" className="bg-gray-400 w-1/6 flex-none h-full overflow-auto">
            <FileTree tree={fileTree} />
          </div>
          <div id="editor" className="bg-slate-500 flex-1">
            <Editor />
          </div>
        </div>
        <div id="terminal-cont" className="flex-none">
          <Terminal />
        </div>
      </div>
    </>
  )
}

export default App
