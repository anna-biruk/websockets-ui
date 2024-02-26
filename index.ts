import { dataSource } from './src/db';
import { httpServer } from './src/http_server';
import { webSocketServerRun } from './src/websocket';

const HTTP_PORT = 8181;

dataSource.initialize().then(() => {
  webSocketServerRun();
  httpServer.listen(HTTP_PORT);
  console.log(`Start static http server on the ${HTTP_PORT} port!`);
});
