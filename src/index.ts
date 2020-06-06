import manager from './utils/shardManager';
import log from './utils/log';

const shardReady = () => {
  log('Shard ready~');
};

const start = async () => {
  manager.on('shardCreate', (shard) => {
    shard.on('ready', shardReady);
  });
  manager.spawn('auto', 15000, 60000);
};


start();
