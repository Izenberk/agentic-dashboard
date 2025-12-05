import { useEffect, useState } from 'react';
import { api } from './lib/api';

function App() {
  const [data, setData] = useState<string>('Loading...');

  useEffect(() => {
    api.index.get().then(({ data }) => {
      if (data) setData(data);
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Agentic Dashboard</h1>
      <p>Backend says: <strong>{data}</strong></p>
    </div>
  );
}

export default App;