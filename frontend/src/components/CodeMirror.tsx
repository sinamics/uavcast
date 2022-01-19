import React, { useEffect, useRef, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';

interface ConsoleMessage {
  message: string;
  path: string;
}
interface ConsoleProps {
  stdout: string;
  error?: ConsoleMessage[];
  placeholder?: string;
  defaultLines?: number;
}
// const convertBash = (code: any) => {
//   return {
//     '[1;30m': '<span style="color:black">',
//     '[1;31m': '<span style="color:red">',
//     '[1;32m': '<span style="color:green">',
//     '[1;33m': '<span style="color:yellow">',
//     '[1;34m': '<span style="color:blue">',
//     '[1;35m': '<span style="color:purple">',
//     '[1;36m': '<span style="color:cyan">',
//     '[1;37m': '<span style="color:white">',
//     '[m': '</span>'
//   };
// };
const RaspberryConsole = ({ stdout, error, placeholder = 'console', defaultLines = 0 }: ConsoleProps) => {
  const [msg, setMsg] = useState<string>(placeholder + '\n'.repeat(defaultLines));
  const CodemirrorRef = useRef(null);

  useEffect(() => {
    if (error?.length) return setMsg(`Error: ${error[0].message}`);

    if (stdout) {
      // stdout.replace()
      setMsg(stdout);
    }
  }, [stdout, error]);

  return (
    <CodeMirror
      ref={CodemirrorRef.current}
      value={msg || placeholder}
      //   autoFocus={true}
      options={{
        lineNumbers: true,
        lineWrapping: true,
        readOnly: true,
        mode: 'markdown',
        theme: 'material'
      }}
      //   onBeforeChange={(editor, data, value) => {
      //     this.setState({ value });
      //   }}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange={(editor, metadata, value) => {}}
    />
  );
};

export default RaspberryConsole;
