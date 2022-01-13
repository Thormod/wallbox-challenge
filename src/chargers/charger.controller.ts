import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Charger } from './dto/charger.dto';
import { ChargerService } from './charger.service';

@Controller()
@Injectable()
export class ChargerController {
  constructor(private readonly chargerService: ChargerService) {}

  @Get('/charger')
  async getChargers(): Promise<Charger[]> {
    return await this.chargerService.getChargers();
  }

  @Get('/charger/:serialNumber')
  async getChargerByChargerId(
    @Param('serialNumber') serialNumber: string
  ): Promise<Charger> {
    return await this.chargerService.getChargerByChargerId(serialNumber);
  }

  @Post('/charger')
  async addAccessory(@Body() newCharger: Charger): Promise<Charger> {
    const result = await this.chargerService.addCharger(newCharger);

    console.info(
      `Devices controller just saved a new charger ${JSON.stringify(result)}`
    );

    return result;
  }

  @Put('/charger/:serialNumber')
  async updateCharger(
    @Param('serialNumber') serialNumber: string,
    @Body() newCharger: Charger
  ): Promise<Charger> {
    const result = await this.chargerService.updateCharger(
      serialNumber,
      newCharger
    );

    console.info(
      `Devices controller just updated a charger ${JSON.stringify(result)}`
    );

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Delete('/charger/:serialNumber')
  async deleteChargerBySerialNumber(
    @Param('serialNumber') serialNumber: string
  ) {
    return await this.chargerService.deleteChargerBySerialNumber(serialNumber);
  }
}
