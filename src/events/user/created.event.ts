import * as _ from 'lodash';
import {
  EventHandlerBase,
  ServiceResources,
} from 'polymetis-node';
import { TOPICS } from '../../submodule/events';

export default class Handler extends EventHandlerBase {
  public topic = TOPICS.USER.CREATED;

  constructor(resources: ServiceResources) {
    super(resources);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async handleCallback(data: any): Promise<void> {
    this.resources.logger.debug(this.topic, data);
  }
}
