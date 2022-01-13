import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'charger' })
export class ChargerModel {
  @PrimaryGeneratedColumn('uuid')
  serial_number: string;

  @Column({ name: 'battery_level', type: 'float', nullable: false })
  batteryLevel!: number;

  @Column({ name: 'model', type: 'varchar', nullable: false })
  model!: string;

  @Column({ name: 'battery_type', type: 'varchar', nullable: false })
  batteryType!: string;

  @Column({ name: 'injection', type: 'varchar', nullable: false })
  injection!: string;

  @Column({ name: 'protection_rating', type: 'varchar', nullable: false })
  protectionRating!: string;

  @Column({ name: 'communication_protocol', type: 'varchar', nullable: false })
  communicationProtocol!: string;

  @Column({ name: 'internet_connection', type: 'boolean', nullable: false })
  internetConnection!: boolean;

  @Column({ name: 'supported_voltage', type: 'float', nullable: false })
  supportedVoltage!: number;

  @Column({ name: 'kw', type: 'float', nullable: false })
  kW!: number;

  @Column({ name: 'join_date', type: 'timestamptz', nullable: false })
  joinDate!: Date;
}
