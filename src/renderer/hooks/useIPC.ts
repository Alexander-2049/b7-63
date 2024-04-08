import { useState, useEffect } from 'react';

function useIPC() {
  const [value, setValue] = useState<number | null>(null);
  const [valueType, setValueType] = useState<string | null>(null);
  const [measureType, setMeasureType] = useState<string | null>(null);
  const [connection, setConnection] = useState<boolean>(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('data-connect');

    const handleConnectionStatus = (event: unknown) => {
      if (typeof event === 'boolean') setConnection(event);
    };
    const handleValue = (event: unknown) => {
      if (typeof event === 'number') setValue(event);
    };
    const handleMeasureType = (event: unknown) => {
      if (typeof event === 'string') setMeasureType(event);
    };
    const handleValueType = (event: unknown) => {
      if (typeof event === 'string') setValueType(event);
    };

    const a = window.electron.ipcRenderer.on(
      'data-connection-status',
      handleConnectionStatus,
    );
    const b = window.electron.ipcRenderer.on('data-value', handleValue);
    const c = window.electron.ipcRenderer.on(
      'data-measure-type',
      handleMeasureType,
    );
    const d = window.electron.ipcRenderer.on(
      'data-value-type',
      handleValueType,
    );

    return () => {
      a();
      b();
      c();
      d();
    };
  }, []);

  return { value, valueType, measureType, connection };
}

export default useIPC;
