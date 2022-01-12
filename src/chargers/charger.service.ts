import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChargerModel } from './charger.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Charger } from './dto/charger.dto';

@Injectable()
export class ChargerService {
  constructor(
    @InjectRepository(ChargerModel)
    private readonly chargerRepository: Repository<ChargerModel>
  ) {}

  async getChargers(): Promise<ChargerModel[] | null> {
    const results = await this.chargerRepository.find();
    return results;
  }

  async getChargerByChargerId(
    chargerSerialNumber: string
  ): Promise<ChargerModel | null> {
    console.log(`About to fetch Charger with id: ${chargerSerialNumber}`);
    const result = await this.chargerRepository.findOne({
      where: {
        serialNumber: chargerSerialNumber,
      },
    });

    if (!result) {
      throw new Error('Charger-by-id-not-found');
    }

    return result;
  }

  async addCharger(charger: Charger): Promise<ChargerModel> {
    const newCharger = await this.chargerRepository.create(charger);
    newCharger.joinDate = new Date();
    const result = await this.chargerRepository.save(newCharger);
    return result;
  }

  async updateCharger(serialNumber: string, charger: Charger): Promise<ChargerModel> {
    const requiredCharger = await this.chargerRepository.findOne({
      where: {
        serialNumber: serialNumber,
      },
    });
    this.chargerRepository.merge(requiredCharger, charger);
    const result = await this.chargerRepository.save(requiredCharger);
    return result;
  }

  async deleteChargerBySerialNumber(chargerSerialNumber: string) {
    const result = await this.chargerRepository.delete(chargerSerialNumber);
    return result;
  }

  convertModelToEntity(chargerModel: ChargerModel): Charger {
    return {
      serialNumber: chargerModel.serialNumber,
      batteryLevel: chargerModel.batteryLevel,
      model: chargerModel.model,
      batteryType: chargerModel.batteryType,
      injection: chargerModel.injection,
      protectionRating: chargerModel.protectionRating,
      communicationProtocol: chargerModel.communicationProtocol,
      internetConnection: chargerModel.internetConnection,
      supportedVoltage: chargerModel.supportedVoltage,
      kW: chargerModel.kW,
      joinDate: chargerModel.joinDate,
    };
  }
}