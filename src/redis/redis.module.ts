import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { redisStore as store } from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { Env } from 'env';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService<Env>) =>
        <RedisClientOptions>{
          store,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
