import { useEffect, useState } from "react"
import Terminal from "./components/Terminal"
import FileTree from "./components/FileTree";


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

  return (
    <>
      <div id="playground" className="flex flex-col h-screen justify-between ">
        <div id="editor-cont" className="min-h-[50vh]">
          <div id="files" className="">
            <div>helo</div>
            <hr />
            <FileTree tree={fileTree} />
          </div>
          <div id="editor" className="">
            
          </div>
        </div>
        <div id="terminal-cont" className="">
          <Terminal />
        </div>
      </div>
    </>
  )
}

export default App
