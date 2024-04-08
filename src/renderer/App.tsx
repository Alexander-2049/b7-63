import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [value, setValue] = useState<number | null>(null);
  const [valueType, setValueType] = useState<string | null>(null);
  const [measureType, setMeasureType] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('data-connect');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('data-connection-status', (event) => {
      if (typeof event === 'boolean') setConnection(event);
    });
    window.electron.ipcRenderer.on('data-value', (event) => {
      if (typeof event === 'number') setValue(event);
    });
    window.electron.ipcRenderer.on('data-measure-type', (event) => {
      if (typeof event === 'string') setMeasureType(event);
    });
    window.electron.ipcRenderer.on('data-value-type', (event) => {
      if (typeof event === 'string') setValueType(event);
    });
  }, []);

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
      <div>
        <p>{value || 'No value'}</p>
        <p>{valueType || 'No value type'}</p>
        <p>{measureType || 'No measure type'}</p>
        <p>{connection ? 'Connected' : 'Disconnected'}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
