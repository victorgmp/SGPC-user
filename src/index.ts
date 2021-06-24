import { ServiceBase, Configuration } from 'polymetis-node';
import * as bodyParser from 'body-parser';
import cors from 'cors';

// Initializing service
const configuration: Partial<Configuration> = {
  baseDir: __dirname,
};

const service = new ServiceBase({ configuration });

service.init()
  .then(async () => {
    await service.initTasks();
    await service.initEvents();

    // service.rpcApp.use(bodyParser.json());
    // service.rpcApp.use(bodyParser.urlencoded({ extended: false }));
    await service.initRPCs();

    service.apiApp.use(bodyParser.json());
    service.apiApp.use(bodyParser.urlencoded({ extended: false }));
    service.apiApp.use(cors());
    await service.initAPI();

    service.logger.info('Service online on pid', process.pid);
  })
  .catch((error: any) => {
    service.logger.error('Exiting', error);
  });
