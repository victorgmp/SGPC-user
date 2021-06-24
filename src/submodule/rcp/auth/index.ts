import { ServiceResources } from 'polymetis-node';
import RPCBase from '../.base';
import { IAuth } from '../../core/model';

export default class AuthRPC extends RPCBase {
  constructor(resources: ServiceResources) {
    super('auth', resources);
  }

  auth = {
    // eslint-disable-next-line arrow-body-style
    verifyAccessToken: async (token: string): Promise<IAuth> => {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await this.call<IAuth>('auth.verify-access-token', { token });
    },
  };
}
