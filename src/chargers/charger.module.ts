import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargerModel } from './charger.model';
import { ChargerService } from './charger.service';
import { ChargerController } from './charger.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChargerModel])],
  providers: [ChargerService],
  controllers: [ChargerController],
  exports: [ChargerService],
})
export class ChargerModule {}
