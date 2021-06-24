import * as _ from 'lodash';
import {
  Request,
  Response,
  RouteHandlerBase,
  RouteBaseTrustedMethods,
  ServiceResources,
} from 'polymetis-node';
import AuthService from '../service';
import { IUser } from '../model/User';

export default class ApiRouteImpl extends RouteHandlerBase {
  public method: RouteBaseTrustedMethods = 'get';
  public url = '/:id';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    const id: string | null = _.get(req.params, 'id', null);

    if (
      !_.isString(id)
      || !_.isEmpty(id)
    ) {
      this.throwError(400, 'Invalid id');
    }

    const userService = new AuthService(this.resources);
    const user: IUser = await userService.getById(id);

    res.json({ user });
  }
}
