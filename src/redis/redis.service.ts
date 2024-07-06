import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setAvailableSpots(spotDate: string, availableSpotTimes: string[]) {
    try {
      return await this.cacheManager.set(spotDate, availableSpotTimes);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e);
      }
    }
  }

  async getAvailableSpots(spotDate: string) {
    try {
      return await this.cacheManager.get<string[]>(spotDate);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e);
      }
    }
  }

  async removeAvailableSpots(spotDate: string) {
    try {
      return await this.cacheManager.del(spotDate);
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(e);
      }
    }
  }
}
