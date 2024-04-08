import { createContext } from 'react';
import { IPCState } from '../hooks/useIPC';

const IpcContext = createContext<IPCState>({
  connection: false,
  measureType: null,
  value: null,
  valueType: null,
});

export default IpcContext;
