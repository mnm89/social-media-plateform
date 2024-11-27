import Redis from 'ioredis';
interface ICacheConfig {
  client: Redis;
}
export function CacheConfig(): ICacheConfig {
  return {
    client: new Redis(process.env.REDIS_URL),
  };
}
