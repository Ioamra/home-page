import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CustomCacheService } from './custom-cache.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [CustomCacheService],
  exports: [CustomCacheService],
})
export class CustomCacheModule {}
