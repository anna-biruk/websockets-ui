import { WebSocketServer } from 'ws';
import { Message, MessageType } from '../types/IRegRequest';
import { userAuth } from './userAuth';
import gameRoom from './gameRoom';

const webSocketServerRun = (): void => {
  const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

  wss.on('connection', (ws) => {
    console.log('Websocket connection successfully established.');

    ws.on('message', async (message) => {
      const parsedMessage: Message<string> = JSON.parse(message.toString());
      if (parsedMessage.type === MessageType.reg) {
        const response = await userAuth(parsedMessage);
        ws.send(JSON.stringify(response));
      }
      if (parsedMessage.type === MessageType.create_room) {
        const response = gameRoom();
        ws.send(JSON.stringify(response));
      }
    });

    ws.on('close', function close() {
      console.log('Client disconnected');
    });
  });
};

export { webSocketServerRun };
