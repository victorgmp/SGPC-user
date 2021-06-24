import * as _ from 'lodash';
import {
  Request,
  Response,
  RouteBaseTrustedMethods,
  ServiceResources,
} from 'polymetis-node';
import UsersService from '../service';
import CustomApiRoute from '../submodule/lib/CustomApiRoute';

export default class ApiRouteImpl extends CustomApiRoute {
  public method: RouteBaseTrustedMethods = 'get';
  public url = '/me';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    const auth = await this.requireAuthentication(req);

    const userService = new UsersService(this.resources);
    const user = await userService.getById(auth.userId);
    res.json({ user });
  }
}
