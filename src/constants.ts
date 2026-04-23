import { SecurityThreat } from "./services/securityService";

export const MOCK_THREATS: SecurityThreat[] = [
  {
    id: 'th-1',
    type: 'url',
    source: 'http://auth-bank-verification.com/login?token=abc',
    timestamp: Date.now() - 5000,
    rawMetadata: {
      redirectChain: ['google.com', 'tinyurl.com', 'auth-bank-verification.com'],
      headerAnalysis: 'Unusually high amount of hidden forms',
      geo: 'Unknown'
    }
  },
  {
    id: 'th-2',
    type: 'file',
    source: 'SystemUpdate_v16_Patch.apk',
    timestamp: Date.now() - 10000,
    rawMetadata: {
      fileSize: '12.4MB',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      permissionsRequested: ['READ_SMS', 'RECEIVE_SMS', 'ACCESS_COARSE_LOCATION'],
      signature: 'Unverified'
    }
  },
  {
    id: 'th-3',
    type: 'file',
    source: 'Invoice_8842.pdf.exe',
    timestamp: Date.now() - 15000,
    rawMetadata: {
      doubleExtension: true,
      entropy: 'High',
      packed: 'UPX'
    }
  },
  {
    id: 'th-4',
    type: 'url',
    source: 'https://github.com/react-native/releases/tag/v0.74.0',
    timestamp: Date.now() - 20000,
    rawMetadata: {
      verifiedDomain: true,
      ssl: 'Valid',
      reputation: 'Trusted'
    }
  },
  {
    id: 'th-5',
    type: 'url',
    source: 'http://192.168.1.1/cgi-bin/config?cmd=rm%20-rf',
    timestamp: Date.now() - 30000,
    rawMetadata: {
      localNetwork: true,
      injectionDetected: true
    }
  }
];

export const STATUS_COLORS = {
  Safe: 'text-emerald-400',
  Warning: 'text-amber-400',
  Danger: 'text-rose-500',
  Scanning: 'text-sky-400'
};
