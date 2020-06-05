import { ShardingManager } from 'discord.js';

let manager : ShardingManager = null;

export default manager = new ShardingManager('dist/bot.js', { token: process.env.DISCORD_TOKEN });
