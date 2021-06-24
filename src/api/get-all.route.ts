/* eslint-disable class-methods-use-this */
import * as _ from 'lodash';
import {
  Request,
  Response,
  RouteBaseTrustedMethods,
  ServiceResources,
} from 'polymetis-node';

import CustomApiRoute from '../submodule/lib/CustomApiRoute';
import UsersService from '../service';
import { IUser } from '../submodule/core/model';

export default class ApiRouteImpl extends CustomApiRoute {
  public method: RouteBaseTrustedMethods = 'get';
  public url = '/';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public getUsernames(req: Request): string[] {
    if (!_.has(req, 'query.username')) {
      return [];
    }

    if (_.isEmpty(req.query.username)) {
      return [];
    }

    if (!_.isArray(req.query.username)) {
      return [req.query.username];
    }

    return req.query.username;
  }

  public getIds(req: Request): string[] {
    if (!_.has(req, 'query.ids')) {
      return [];
    }

    if (_.isEmpty(req.query.ids)) {
      return [];
    }

    if (!_.isArray(req.query.ids)) {
      return [req.query.ids];
    }

    return req.query.ids;
  }

  public async callback(req: Request, res: Response): Promise<any> {
    const usernames = this.getUsernames(req);
    if (!_.isEmpty(usernames)) {
      return this.getByUsernames(usernames, req, res);
    }

    return this.getAll(req, res);
  }

  private async getByUsernames(
    usernames: string[],
    req: Request,
    res: Response,
  ): Promise<any> {
    const userService = new UsersService(this.resources);
    const users: IUser[] = await userService.getByUsernames(usernames);

    res.json({ users });
  }

  private async getAll(req: Request, res: Response): Promise<any> {
    res.json({ users: [] });
  }
}
