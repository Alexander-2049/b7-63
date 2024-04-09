import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import useIPC from './hooks/useIPC';
import Multimeter from './pages/Multimeter';
import IpcContext from './context/IpcContext';

function Home() {
  const ipc = useContext(IpcContext);

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
        <p>{ipc.value || 'No value'}</p>
        <p>{ipc.valueType || 'No value type'}</p>
        <p>{ipc.measureType || 'No measure type'}</p>
        <p>{ipc.connection ? 'Connected' : 'Disconnected'}</p>
      </div>
      <div>
        <Link to="/multimeter">
          <button type="button">Multimeter</button>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const ipc = useIPC();

  return (
    <IpcContext.Provider value={ipc}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/multimeter" element={<Multimeter />} />
        </Routes>
      </Router>
    </IpcContext.Provider>
  );
}
