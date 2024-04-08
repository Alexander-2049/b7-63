import { useContext } from 'react';
import { Link } from 'react-router-dom';
import IpcContext from '../context/IpcContext';

function Multimeter() {
  const data = useContext(IpcContext);

  return (
    <div>
      <Link to="/">
        <button type="button">Home</button>
      </Link>
      <p>{data.connection ? 'GREEN LIGHT' : 'RED LIGHT'}</p>
    </div>
  );
}

export default Multimeter;
