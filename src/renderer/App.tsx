import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('data-connect');
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('data-connection-status', (event) => {
      // eslint-disable-next-line no-console
      console.log(event);
    });
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
