import React, {useRef} from 'react';
import Textarea from 'react-textarea-autosize';
import beautify from 'json-beautify';
import path from 'path';
import logo from './logo.svg';
import './App.css';

const INDENT_SPACES = 2;
const ROWS = 20;
const COLUMNS = 30;

const schemata = {};

const importSchemata = requireFunc => {
  requireFunc.keys().forEach(schemaPath => {
    const name = path.basename(schemaPath, '.schema.json')
    schemata[name] = requireFunc(schemaPath)
  });
}

importSchemata(require.context('./schema', false, /\.schema\.json$/));

console.log('SCHEMATA', schemata);

const event = {
  dashboardId: 'barr',
  gridCount: 10,
  number: 1,
  name: 'fooo',
  type: 'Ninja'
};

const sendEvent = async (event, schemaName) => {
  const response = await fetch('http://localhost:8000/event', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({event, schema: schemata[schemaName]})
  });
  console.log('RESPONSE', response);
}

function App() {
  const eventTextAreaEl = useRef(null);
  const schemaSelectEl = useRef(null);

  const onClickSendEvent = () => {
    const event = JSON.parse(eventTextAreaEl.current.value);
    sendEvent(event, schemaSelectEl.current.value);
  }

  const schemaNames = Object.keys(schemata);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main className="App-main">
        <div>
          Schema:&nbsp;
          <select ref={schemaSelectEl} defaultValue={schemaNames[0]}>
            {
              schemaNames.map(name => <option key={name} value={name}>{name}</option>)
            }
          </select>
        </div>
        <Textarea
          inputRef={eventTextAreaEl}
          defaultValue={beautify(event, null, INDENT_SPACES, COLUMNS)}
          rows={ROWS}
          cols={COLUMNS} />
        <button onClick={onClickSendEvent}>Send Event</button>
      </main>
    </div>
  );
}

export default App;
