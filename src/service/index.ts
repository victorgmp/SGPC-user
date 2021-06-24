import { ServiceResources } from 'polymetis-node';
import UserModel, { IUserExternal, IUser, IUserStatus } from '../model/User';
import Errors from '../submodule/errors';

export default class UserService {
  private model: UserModel;

  constructor(
    public resources: ServiceResources,
  ) {
    this.model = new UserModel(resources);
  }

  async getById(id: string): Promise<IUser> {
    try {
      const user: IUserExternal = await this.model.getOne(id);
      return this.toPublic(user);
    } catch (error) {
      throw new Error(Errors.USER.USER_NOT_FOUND);
    }
  }

  async getByIds(ids: string[]): Promise<IUser[]> {
    const users: IUserExternal[] = await this.model.getByIds(ids);

    return users.map(this.toPublic);
  }

  async getByUsername(username: string): Promise<IUser> {
    const user: IUserExternal | null = await this.model.getByUsername(username);

    if (!user) {
      throw new Error(Errors.USER.USER_NOT_FOUND);
    }

    return this.toPublic(user);
  }

  async getByUsernames(usernames: string[] = []): Promise<IUser[]> {
    const users: IUserExternal[] = await this.model.getByUsernames(usernames);

    return users.map(this.toPublic);
  }

  async update(data: IUser): Promise<IUser> {
    let user: IUserExternal;
    try {
      user = await this.model.getOne(data.id);
    } catch (error) {
      throw new Error(Errors.USER.USER_NOT_FOUND);
    }

    user.name = data.name;
    user = await this.model.update(user);

    return this.toPublic(user);
  }

  async create(data: Pick<IUser, 'username'>): Promise<IUser> {
    let user: IUserExternal | null = await this.model.getByUsername(
      data.username,
    );

    if (user) {
      throw new Error(Errors.USER.USER_ALREADY_EXISTS);
    }

    user = {
      id: null,
      username: data.username,
      name: '',
      status: IUserStatus.active,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    user = await this.model.create(user);

    return this.toPublic(user);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.model.delete(id);
    } catch (error) {
      throw new Error(Errors.USER.USER_NOT_FOUND);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private toPublic(user: IUserExternal): IUser {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  }
}
