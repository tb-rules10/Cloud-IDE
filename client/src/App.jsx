import Terminal from "./components/Terminal"


function App() {

  return (
    <>
      <div id="playground" className="flex flex-col">
        <div id="editor-cont" className="min-h-[50vh]">
          
        </div>
        <div id="terminal-cont" className="">
          <Terminal />
        </div>
      </div>
    </>
  )
}

export default App
