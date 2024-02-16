import { Message, MessageType, RegRequest } from "../types/IRegRequest";
import { dataSource } from "../db";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

const userRepository = dataSource.getRepository(User);

const userAuth = async (message: Message<string>): Promise<Message<string>> => {
  const { name, password } = JSON.parse(message.data) as RegRequest;

  try {
    const existingUser = await userRepository.findOne({ where: { name } });

    if (existingUser) {
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordMatch) {
        throw new Error("Incorrect password");
      }

      console.log("User authenticated successfully:", existingUser);

      return {
        type: MessageType.reg,
        data: JSON.stringify({
          name: existingUser.name,
          index: existingUser.id,
          error: false,
          errorText: "",
        }),
        id: message.id,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(name, hashedPassword);

    const savedUser = await userRepository.save(newUser);

    console.log("User created and authenticated successfully:", newUser);

    return {
      type: MessageType.reg,
      data: JSON.stringify({
        name: savedUser.name,
        index: savedUser.id,
        error: false,
        errorText: "",
      }),
      id: message.id,
    };
  } catch (error: Error | any) {
    console.error("Authentication error:", error);
    return {
      type: MessageType.reg,
      data: JSON.stringify({
        name: name,
        index: 0,
        error: true,
        errorText: error.message || "Authentication error",
      }),
      id: message.id,
    };
  }
};

export { userAuth };
