import {WebSocket, WebSocketServer} from 'ws';
import {Message, MessageType} from '../types/IRegRequest';
import {userAuth} from './userAuth';
import gameRoomService from '../services/gameRoomService';
import {User} from "../entity/User";

const sendAvailableRooms = async (wss: WebSocketServer) => {
  const availableRooms = await gameRoomService.getRoomsWithOnePlayer();

  const payload = { type: MessageType.updateRoom, data: JSON.stringify(availableRooms), id: 0 };
  wss.clients.forEach((c) => {
    c.send(JSON.stringify(payload));
  });
};

const connections = new Map()

const webSocketServerRun = (): void => {
  const wss: WebSocketServer = new WebSocketServer({ port: 3000 });

  wss.on('connection', (ws: WebSocket & { userId: string }) => {
    console.log('Websocket connection successfully established.');
    ws.on('message', async (message) => {
      const parsedMessage: Message<string> = JSON.parse(message.toString());
      if (parsedMessage.type === MessageType.reg) {
        const response = await userAuth(parsedMessage);
        const data = JSON.parse(response.data);
        if (!data.error) {
          ws.userId = data.index;
        }

        connections.set(ws.userId, ws)

        ws.send(JSON.stringify(response));
        await sendAvailableRooms(wss);
      }
      if (parsedMessage.type === MessageType.createRoom) {
        const room = await gameRoomService.create();
        await gameRoomService.addUserToRoom(room, ws.userId);
        await sendAvailableRooms(wss);
      }

      if(parsedMessage.type === MessageType.addUserToRoom) {
        const {indexRoom} = JSON.parse(parsedMessage.data) as {indexRoom: string}
        const room = await gameRoomService.findRoomById(indexRoom)
        if(room) {
            await gameRoomService.addUserToRoom(room, ws.userId)
        }
        await sendAvailableRooms(wss);

        if(room?.users?.length === 2) {
            const [firstUser, secondUser] = room.users

            const generateMessage = (userId: string) => {
                return JSON.stringify({
                    type: 'create_game',
                    data: JSON.stringify({
                        idGame: room.id,
                        idPlayer: userId,
                    }),
                    id: 0,
                })
            }
            connections.get(firstUser.id).send(generateMessage(firstUser.id))
            connections.get(secondUser.id).send(generateMessage(secondUser.id))
        }
      }
    });

    ws.on('close', function close() {
      console.log('Client disconnected');
    });
  });
};

export { webSocketServerRun };
