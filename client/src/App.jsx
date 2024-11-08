import { useEffect, useState } from "react";
import Terminal from "./components/Terminal";
import FileTree from "./components/FileTree";
import socket from "./socket";
import Editor from "./components/Editor";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

function App() {
  const [fileTree, setFileTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    const response = await fetch("http://localhost:5000/files");
    const res = await response.json();
    setFileTree(res.tree);
  };

  useEffect(() => {
    if (!selectedFile) return;

    const fetchFileContents = async () => {
      try {
        const res = await fetch(`http://localhost:9000/files/content?path=${encodeURIComponent(selectedFile)}`);
        const content = await res.json();
        setSelectedFileContent(content.content);
      } catch (error) {
        console.error('Error fetching file content:', error);
      }
    };

    fetchFileContents();
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile && selectedFileContent) {
      setCode(selectedFileContent || "")
    }
  }, [selectedFile, selectedFileContent])

  
  useEffect(() => {
    setCode("");
  }, [selectedFile]);

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socket.on('file-refresh', getFileTree);
    return () => {
      socket.off('file-refresh');
    };
  }, []);

  useEffect(() => {
    if (code !== undefined && selectedFile && !isSaved) {
      const timer = setTimeout(() => {
        socket.emit("code-update", code, selectedFile);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, isSaved, selectedFile]);

  return (
    <div id="playground" className="flex flex-col h-screen">
      <div id="editor-cont" className="min-h-[50vh] flex flex-row w-screen bg-red-500 flex-grow">
        <ResizableBox
          width={200}
          height={Infinity}
          minConstraints={[150, Infinity]}
          maxConstraints={[400, Infinity]}
          className="bg-gray-400 h-full overflow-auto"
        >
          <FileTree 
            onSelect={(path) => setSelectedFile(path)}
            tree={fileTree}
          />
        </ResizableBox>
        <div id="editor" className="bg-slate-500 flex-1">
          {selectedFile && <p className="bg-black text-white">{selectedFile.replaceAll("/", " > ")}</p>}
          <Editor 
            code={code}
            setCode={setCode}
            selectedFile={selectedFile} />
        </div>
      </div>
      <div id="terminal-cont" className="flex-none">
        <Terminal />
      </div>
    </div>
  );
}

export default App;
