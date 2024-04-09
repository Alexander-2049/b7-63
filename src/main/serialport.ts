import { IpcMainEvent, ipcMain } from 'electron';
import { SerialPort } from 'serialport';

export enum ValueType {
  NORMAL_AC = 'NORMAL_AC',
  NORMAL_DC = 'NORMAL_DC',
  NORMAL_SUM_DC_AC = 'NORMAL_SUM_DC_AC',
  NORMAL_SELECTOR_AC = 'NORMAL_SELECTOR_AC',
  MAX_AC = 'MAX_AC',
  MAX_SUM_DC_AC = 'MAX_SUM_DC_AC',
  MAX_SELECTOR_AC = 'MAX_SELECTOR_AC',
  MAX_NEGATIVE_AC = 'MAX_NEGATIVE_AC',
  UNKNOWN = 'UNKNOWN',
}

export enum MeasureType {
  RESISTANCE_KOM = 'RESISTANCE_KOM',
  RESISTANCE_MOM = 'RESISTANCE_MOM',
  VOLTAGE_V = 'VOLTAGE_V',
  VOLTAGE_DIODE_V = 'VOLTAGE_DIODE_V',
  CURRENT_MILAMPS = 'CURRENT_MILAMPS',
  FREQ_HZ = 'FREQ_HZ',
  FREQ_KHZ = 'FREQ_KHZ',
  RESISTANCE_INFINITE = 'RESISTANCE_INFINITE',
  UNKNOWN = 'UNKNOWN',
}

interface Measurement {
  valueType: ValueType;
  measureType: MeasureType;
  value: number;
}

function getValueType(value: string): ValueType {
  switch (value[0]) {
    case 'A':
      return ValueType.NORMAL_AC;
    case '+':
    case '-':
      return ValueType.NORMAL_DC;
    case 'S':
      return ValueType.NORMAL_SUM_DC_AC;
    case 'B':
      return ValueType.NORMAL_SELECTOR_AC;
    case 'P':
      return ValueType.MAX_AC;
    case 'E':
      return ValueType.MAX_SUM_DC_AC;
    case 'C':
      return ValueType.MAX_SELECTOR_AC;
    case 'N':
      return ValueType.MAX_NEGATIVE_AC;
    default:
      if (value === 'OL') return ValueType.NORMAL_DC;
      return ValueType.UNKNOWN;
  }
}

function getMeasureType(value: string): MeasureType {
  const trimmedValue = value.trim();
  switch (trimmedValue[trimmedValue.length - 1]) {
    case 'O':
      return MeasureType.RESISTANCE_KOM;
    case 'G':
      return MeasureType.RESISTANCE_MOM;
    case 'V':
      return MeasureType.VOLTAGE_V;
    case 'T':
      return MeasureType.VOLTAGE_DIODE_V;
    case 'M':
      return MeasureType.CURRENT_MILAMPS;
    case 'Z':
      return MeasureType.FREQ_HZ;
    case 'H':
      return MeasureType.FREQ_HZ;
    case 'K':
      return MeasureType.FREQ_KHZ;
    case 'L':
      return MeasureType.RESISTANCE_INFINITE;
    default:
      return MeasureType.UNKNOWN;
  }
}

function getNumber(value: string): number {
  const possiblePrefixes = [
    'A',
    'S',
    'B',
    'P',
    'E',
    'C',
    'N',
    'O',
    'G',
    'V',
    'T',
    'M',
    'Z',
    'K',
    'L',
  ];

  if (typeof value !== 'string') return NaN;
  let processedValue = value.trim();
  if (processedValue === 'OL') return 0;

  if (possiblePrefixes.some((e) => e === processedValue[0])) {
    processedValue = processedValue.substring(1);
  }

  if (Number.isNaN(Number(processedValue[processedValue.length - 1]))) {
    processedValue = processedValue.substring(0, processedValue.length - 1);
  }

  if (processedValue[0] === '.') {
    processedValue = `0${processedValue}`;
  }

  return Number(processedValue);
}

function parseMeasurement(value: string): Measurement {
  const trimmedValue = value.trim();
  const valueType = getValueType(trimmedValue);
  const measureType = getMeasureType(trimmedValue);
  const numericValue = getNumber(trimmedValue);
  return { valueType, measureType, value: numericValue };
}

let e: IpcMainEvent | null = null;

ipcMain.on('data-connect', async (event) => {
  e = event;
});

const startScanning = async (): Promise<void> => {
  const result = await SerialPort.list();
  if (result.length < 1) {
    e?.reply('data-connection-status', false);
    setTimeout(startScanning, 1000); // Wait for 1 second and retry
    return;
  }

  const port = new SerialPort({
    path: result[0].path,
    baudRate: 9600,
    autoOpen: true,
  });

  let string = '';

  port.on('data', (data: Buffer) => {
    if (!Buffer.isBuffer(data)) return;
    const symbol = data.toString();

    if (symbol === '\n') {
      const { valueType, measureType, value } = parseMeasurement(string);
      e?.reply('data-connection-status', true);
      e?.reply('data-value', value);
      e?.reply('data-value-type', valueType);
      e?.reply('data-measure-type', measureType);

      string = '';
    } else {
      string += symbol;
    }
  });

  port.on('close', () => {
    e?.reply('data-connection-status', false);
    startScanning(); // Restart port scanning
  });

  port.on('error', () => {
    e?.reply('data-connection-status', false);
    startScanning(); // Restart port scanning
  });
};

export default startScanning;
