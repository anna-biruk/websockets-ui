import ICreateRoom from '../types/ICreateRoom';
import {Message} from "../types/IRegRequest";
type Game = {
  index: number;
};
const games: Game[] = [];

const gameRoom = () => {
  games.push({ index: games.length });

  return {
    type: 'create_game',
    data: JSON.stringify({
      idGame: games.length - 1,
      idPlayer: 0,
    }),
    id: 0,
  };
};

export default gameRoom;
