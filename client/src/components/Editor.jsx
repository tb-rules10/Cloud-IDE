/* eslint-disable react/prop-types */
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import { useEffect, useState } from "react";

function Editor({ code, setCode, selectedFile }) {

  return (
    <AceEditor
      value={code}
      onChange={e => selectedFile && setCode(e)}
      height="50vh"
      width="full"
      mode="javascript"
      theme="monokai"
      fontSize="16px"
      highlightActiveLine={true}
      setOptions={{
        enableLiveAutocompletion: true,
        showLineNumbers: true,
        tabSize: 2
      }}
    />
  );
}
export default Editor;