import { dataSource } from '../db';
import { Room } from '../entity/Room';
import { User } from '../entity/User';

class GameRoomService {
  gameRoomRepository = dataSource.getRepository(Room);
  //   userRepository = dataSource.getRepository(User);
  async create() {
    const room = new Room();
    await this.gameRoomRepository.save(room);

    return room;
  }

  async addUserToRoom(room: Room, userId: string) {
    if (room.users) {
      room.users.push({ id: userId } as User);
    } else {
      room.users = [{ id: userId } as User];
    }
    await this.gameRoomRepository.save(room);
  }

  async getRoomsWithOnePlayer() {
    const rooms = this.gameRoomRepository.createQueryBuilder('room')
        .leftJoinAndSelect('room.users', 'user')
        .groupBy('room.id')
        .having('COUNT(user.id) = :count', {count:1})
        .getMany()
    console.log(rooms)

    return rooms
  }
}

export default new GameRoomService();
