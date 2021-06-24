import _ from 'lodash';
import { RPCHandlerBase } from 'polymetis-node';
import UserService from '../service';
import { IUser } from '../model/User';
import Errors from '../submodule/errors';
import { TOPICS } from '../submodule/events';

export default class RPCImpl extends RPCHandlerBase {
  public procedure = 'user.create';

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async callback({ transactionId, payload }): Promise<IUser> {
    const username = _.get(payload, 'username', '');

    if (_.isEmpty(username)) throw Error(Errors.USER.INVALID_USERNAME);
    if (!_.isString(username)) throw Error(Errors.USER.INVALID_USERNAME);

    const userService = new UserService(this.resources);

    const user = await userService.create({ username });

    this.emitEvent(TOPICS.USER.CREATED, { user });
    return user;
  }
}
