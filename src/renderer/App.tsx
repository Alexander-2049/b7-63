import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
// import { MeasureType, ValueType } from '../main/serialport';

// function isValueType(value: unknown): value is ValueType {
//   return Object.values(ValueType).includes(value as ValueType);
// }

// function isMeasureType(value: unknown): value is MeasureType {
//   return Object.values(MeasureType).includes(value as MeasureType);
// }

function Hello() {
  // const [value, setValue] = useState<number | null>(null);
  // const [valueType, setValueType] = useState<ValueType | null>(null);
  // const [measureType, setMeasureType] = useState<MeasureType | null>(null);
  const [connection, setConnection] = useState<boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('data-connect');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('data-connection-status', (event) => {
      if (typeof event === 'boolean') setConnection(event);
    });
    // window.electron.ipcRenderer.on('data-value', (event) => {
    //   if (typeof event === 'number') setValue(event);
    // });
    // window.electron.ipcRenderer.on('data-measure-type', (event) => {
    //   if (isMeasureType(event)) setMeasureType(event);
    // });
    // window.electron.ipcRenderer.on('data-measure-type', (event) => {
    //   if (isValueType(event)) setValueType(event);
    // });
  }, []);

  // useEffect(() => {
  //   const i = setInterval(() => {
  //     window.electron.ipcRenderer.sendMessage('data-connection-status');
  //   }, 1000);

  //   return () => {
  //     clearInterval(i);
  //   };
  // }, []);

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
        {/* <span>{value}</span>
        <span>{valueType}</span>
        <span>{measureType}</span> */}
        <span>{connection ? 'Connected' : 'Disconnected'}</span>
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
