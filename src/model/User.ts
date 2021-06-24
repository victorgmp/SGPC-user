/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import { ServiceResources } from 'polymetis-node';

import { ModelBase, Client } from '../submodule/lib/Mongo';

export { IUser } from '../submodule/core/model';

export enum IUserStatus {
  'active' = 'active',
  'inactive' = 'inactive',
  'deleted' = 'deleted',
}
export interface IUserInternal {
  _id: string;
  username: string;
  name: string;
  status: IUserStatus;
  createdAt: number;
  updatedAt: number;
}

export interface IUserExternal {
  id: string;
  username: string;
  name: string;
  status: IUserStatus;
  createdAt: number;
  updatedAt: number;
}

export default class UserModel extends ModelBase<IUserExternal, IUserInternal> {
  constructor(resources: ServiceResources) {
    super('user', resources);
  }

  public toPublic(obj: IUserInternal): IUserExternal {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: obj._id ? obj._id : null,
      username: obj.username,
      name: obj.name,
      status: obj.status,
      createdAt: new Date((obj.createdAt || new Date())).getTime(),
      updatedAt: new Date((obj.updatedAt || new Date())).getTime(),
    };
  }

  public fromPublic(obj: IUserExternal): IUserInternal {
    return {
      _id: obj.id ? obj.id : null,
      username: obj.username,
      name: obj.name,
      status: obj.status,
      createdAt: new Date((obj.createdAt || new Date())).getTime(),
      updatedAt: new Date((obj.updatedAt || new Date())).getTime(),
    };
  }

  public async getByUsername(
    username: string,
  ): Promise<IUserExternal | null> {
    try {
      await Client.connect(this.resources);
      const collection = Client.database.collection(this.collection);

      const user = await collection.findOne(
        {
          username,
          status: {
            $nin: [
              IUserStatus.deleted,
            ],
          },
        },
      );

      if (!user) {
        return null;
      }

      return this.toPublic(user);
    } catch (error) {
      this.resources.logger.error(this.collection, error.message, error);
      throw error;
    }
  }

  public async getByUsernames(
    usernames: string[],
  ): Promise<IUserExternal[]> {
    try {
      await Client.connect(this.resources);
      const collection = Client.database.collection(this.collection);

      const result = await collection.find(
        {
          username: { $in: usernames },
          status: {
            $nin: [
              IUserStatus.deleted,
            ],
          },
        },
      ).toArray();

      return result.map(this.toPublic);
    } catch (error) {
      this.resources.logger.error(this.collection, error.message, error);
      throw error;
    }
  }
}
