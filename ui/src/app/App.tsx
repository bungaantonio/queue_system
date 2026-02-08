// src/app/App.tsx
import Display from "../pages/Display";
import { QueueStreamProvider } from "./providers/QueueStreamProvider";

function App() {
  return (
    <QueueStreamProvider>
      <Display />
    </QueueStreamProvider>
  );
}

export default App;
