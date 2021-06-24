import _ from 'lodash';
import { RPCHandlerBase } from 'polymetis-node';
import UserService from '../service';
import { IUser } from '../model/User';
import Errors from '../submodule/errors';

export default class RPCImpl extends RPCHandlerBase {
  public procedure = 'user.get-by-id';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async callback({ transactionId, payload }): Promise<IUser> {
    const id = _.get(payload, 'id', '');

    if (_.isEmpty(id)) throw Error(Errors.USER.INVALID_ID);
    if (!_.isString(id)) throw Error(Errors.USER.INVALID_ID);

    const userService = new UserService(this.resources);

    // eslint-disable-next-line @typescript-eslint/return-await
    return await userService.getById(id);
  }
}
