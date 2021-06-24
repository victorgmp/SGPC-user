import _ from 'lodash';
import { RPCHandlerBase } from 'polymetis-node';
import UserService from '../service';
import { IUser } from '../model/User';
import Errors from '../submodule/errors';

export default class RPCImpl extends RPCHandlerBase {
  public procedure = 'user.get-by-username';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async callback({ transactionId, payload }): Promise<IUser> {
    const username = _.get(payload, 'username', '');

    if (_.isEmpty(username)) throw Error(Errors.USER.INVALID_USERNAME);
    if (!_.isString(username)) throw Error(Errors.USER.INVALID_USERNAME);

    const userService = new UserService(this.resources);

    this.resources.logger.debug({ username });
    // eslint-disable-next-line @typescript-eslint/return-await
    return await userService.getByUsername(username);
  }
}
