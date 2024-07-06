import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CeoAgendaModule } from 'ceo-agenda/ceo-agenda.module';
import { CeoAgenda } from 'ceo-agenda/entities/ceo-agenda.entity';
import { Env, envSchema } from 'env';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeeAgendaModule } from './employee-agenda/employee-agenda.module';
import { EmployeeAgenda } from 'employee-agenda/entities/employee-agenda.entity';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: (env) => envSchema.parse(env),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [CeoAgenda, EmployeeAgenda],
        synchronize: configService.get('NODE_ENV') === 'dev',
        logging: configService.get('NODE_ENV') === 'dev' ? 'all' : false,
        logger: 'advanced-console',
      }),
    }),
    ScheduleModule.forRoot(),
    RedisModule,
    CeoAgendaModule,
    EmployeeAgendaModule,
  ],
})
export class AppModule {}
