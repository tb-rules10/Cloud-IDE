import { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import '../css/xterm.css'
import socket from '../socket';

const Terminal = ( ) => {

    const terminalRef = useRef();
    const isRendered = useRef(false);

    useEffect(() => {
        if(isRendered.current)  return;
        isRendered.current = true;

        const term = new XTerminal({
            rows: 15,
        });

        term.open(terminalRef.current);

        term.onData(data => {
            socket.emit('terminal:write', data);
        });

        socket.on('terminal:data', (data) => {
            term.write(data);
        });

    }, []);

    return (
        <div ref={terminalRef} className=' '/>
    )
}

export default Terminal
