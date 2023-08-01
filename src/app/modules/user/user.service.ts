import config from '../../../config';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';

const createUser = async (user: IUser): Promise<IUser | null> => {
  // auto generated incremental id
  const id = await generateUserId();

  user.id = id;

  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  const craetedUser = await User.create(user);

  if (!createUser) {
    throw new Error('Failed to craete user!');
  }

  return craetedUser;
};

export const UserService = {
  createUser,
};
