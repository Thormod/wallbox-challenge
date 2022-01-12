import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargerModule } from './chargers/charger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      synchronize: false,
      logging: true,
      autoLoadEntities: true,
      migrationsRun: true,
      host: 'localhost',
      username: 'thor',
      password: 'root',
      database: 'wallbox',
      migrations: ['dist/src/migration/**/*.js'],
      extra: {
        min: 1,
        max: 10,
      },
    }),
    ChargerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
