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

  async findRoomById(roomId: string) {
    return this.gameRoomRepository.findOne({where: {id: roomId}, relations: {users: true}})
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
    const rooms = await this.gameRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'user')
      .groupBy('room.id')
      .having('COUNT(user.id) = :count', { count: 1 })
      .getMany();

    return rooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.users?.map((u) => ({ index: u.id, name: u.name })) || [],
    }));
  }
}

export default new GameRoomService();
