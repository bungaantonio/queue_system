# Queue Display

Sistema de exibição de fila em tempo real, desenvolvido com React e Vite. Mostra o usuário sendo atendido, próximos da fila, timer, relógio, QR Code para consulta e vídeos informativos.

## Funcionalidades

- Exibe o usuário atual sendo atendido
- Lista os próximos usuários da fila
- Timer circular para cada atendimento
- Relógio em tempo real
- QR Code para consulta de posição na fila
- Vídeos informativos em loop

## Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [qrcode.react](https://github.com/zpao/qrcode.react)
- [react-countdown-circle-timer](https://github.com/vydimitrov/react-countdown-circle-timer)
- [react-player](https://github.com/cookpete/react-player)

## Instalação

```sh
git clone https://github.com/seu-usuario/queue-display.git
cd queue-display
npm install
```

## Uso

Para rodar em modo desenvolvimento:

```sh
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## Build para produção

```sh
npm run build
```

## Estrutura de Pastas

```
src/
  components/      # Componentes React (Clock, CurrentUser, NextUsers, etc)
  hooks/           # Hooks customizados (useQueueData)
  pages/           # Páginas principais (Display)
  utils/           # Funções utilitárias (api.js)
  assets/          # Imagens e ícones
public/
  video1.mp4 ...   # Vídeos exibidos no painel
  vite.svg         # Ícone do projeto
```

## Configuração do Backend

Este projeto espera um backend rodando em `http://127.0.0.1:8000` com as rotas:
- `/queue/current` para usuário atual
- `/queue/list` para lista da fila
- `/queue/consult` para consulta via QR Code

## Licença

MIT