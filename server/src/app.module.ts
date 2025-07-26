import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { CustomCacheModule } from './common/custom-cache/custom-cache.module';
import { IsConnectedGuard } from './common/guards/is-connected.guard';
import { config } from './config/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserAccountModule } from './modules/user_account/user_account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
    }),
    CacheModule.register({
      ttl: 60, // Le temps de vie en secondes
      max: 100, // Nombre maximum d'éléments en cache
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.databaseName'),
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
          autoLoadEntities: true,
          extra: { connectionTimeoutMillis: 10000 },
        };
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
          algorithm: configService.get<string>('jwt.algorithm') as 'HS256' | 'HS384' | 'HS512' | 'RS256',
        },
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    CustomCacheModule,
    AuthModule,
    UserAccountModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: IsConnectedGuard,
    },
  ],
})
export class AppModule {}
