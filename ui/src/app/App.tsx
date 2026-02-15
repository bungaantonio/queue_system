// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; // Importe as rotas que você definiu
import { QueueStreamProvider } from "./providers/QueueStreamProvider";

function App() {
  return (
    // O Provider envolve o Router para que TODAS as páginas (TV e Celular)
    // recebam os dados do sensor em tempo real
    <QueueStreamProvider>
      <RouterProvider router={router} />
    </QueueStreamProvider>
  );
}

export default App;
