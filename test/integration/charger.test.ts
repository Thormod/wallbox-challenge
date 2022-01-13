import { StatusCodes } from 'http-status-codes';
import { closeServer, startServer } from '../../src/server';
import { getAxiosInstance } from '../test-helpers';
import { createCharger } from '../test-helpers/db/db-helpers';
import { v4 as uuidv4 } from 'uuid';
import sinon from 'sinon';

let axios;

describe('(Integration) Beacons', () => {
  beforeAll(async () => {
    const appUnderTest = await startServer(null);
    axios = getAxiosInstance(await appUnderTest.getUrl());
  });

  afterAll(async () => {
    // eslint-disable-next-line import/no-named-as-default-member
    sinon.restore();
    await closeServer();
  });

  describe('/chargers', () => {
    describe('GET', () => {
      describe('when getting all chargers with the GET:/ route', () => {
        test('then a list of chargers should be returned', async () => {
          // Arrange
          const currentDate = new Date();
          const chargerSerialNumber1 = uuidv4();
          const chargerSerialNumber2 = uuidv4();

          const chargerToAdd1 = {
            serial_number: chargerSerialNumber1,
            batteryLevel: 124.54,
            model: 'copper2',
            batteryType: 'lithium',
            injection: 'triphase',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: true,
            supportedVoltage: 7.4,
            kW: 22,
            joinDate: currentDate.toISOString(),
          };

          const chargerToAdd2 = {
            serial_number: chargerSerialNumber2,
            batteryLevel: 150.54,
            model: 'copper3',
            batteryType: 'lithium',
            injection: 'triphase',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: true,
            supportedVoltage: 8.7,
            kW: 42,
            joinDate: currentDate.toISOString(),
          };

          await createCharger(chargerToAdd1);
          await createCharger(chargerToAdd2);

          // Act
          const getResponse = await axios.get('/charger');

          // Assert
          expect(getResponse.status).toBe(StatusCodes.OK);

          expect(getResponse.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining(chargerToAdd1),
              expect.objectContaining(chargerToAdd2),
            ])
          );
        });
      });

      describe('when getting an existing charger with the GET:/:serialNumber route', () => {
        test('then a specific charger should be returned', async () => {
          // Arrange
          const currentDate = new Date();
          const chargerSerialNumber = uuidv4();
          const chargerToAdd = {
            serial_number: chargerSerialNumber,
            batteryLevel: 124.54,
            model: 'copper2',
            batteryType: 'lithium',
            injection: 'triphase',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: true,
            supportedVoltage: 7.4,
            kW: 22,
            joinDate: currentDate.toISOString(),
          };

          await createCharger(chargerToAdd);

          // Act
          const getResponse = await axios.get(
            `/charger/${chargerSerialNumber}`
          );

          // Assert
          expect(getResponse.status).toBe(StatusCodes.OK);
          expect(getResponse.data).toStrictEqual(chargerToAdd);
        });
      });

      describe('when getting an unknown charger with the GET:/:serialNumber route', () => {
        test('then a 404 error is thrown', async () => {
          // Arrange
          const chargerSerialNumber = uuidv4();

          // Act
          const getResponse = await axios.get(
            `/charger/${chargerSerialNumber}`
          );

          // Assert
          expect(getResponse.status).toBe(StatusCodes.NOT_FOUND);
        });
      });
    });

    describe('POST', () => {
      describe('when posting a new valid charger with the POST:/ route', () => {
        const currentDate = new Date();

        let clock;

        beforeEach(() => {
          // eslint-disable-next-line import/no-named-as-default-member
          clock = sinon.useFakeTimers(currentDate.getTime());
        });

        afterEach(() => {
          clock.restore();
        });

        test('then a new charger is added to the DB', async () => {
          // Arrange
          const chargerToAdd = {
            batteryLevel: 124.54,
            model: 'copper2',
            batteryType: 'lithium',
            injection: 'triphase',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: true,
            supportedVoltage: 7.4,
            kW: 22,
          };

          // Act
          const postResponse = await axios.post('/charger', chargerToAdd);
          const newChargerSerialNumber = postResponse.data.serial_number;

          const getResponse = await axios.get(
            `/charger/${newChargerSerialNumber}`
          );

          const expectedCharger = {
            ...chargerToAdd,
            serial_number: newChargerSerialNumber,
            joinDate: currentDate.toISOString(),
          };

          // Assert
          expect(getResponse.status).toBe(StatusCodes.OK);
          expect(getResponse.data).toStrictEqual(expectedCharger);
        });
      });
    });

    describe('PUT', () => {
      describe('when updating an existing charger with the PUT:/:serialNumber route', () => {
        test('then a the specific charger is updated', async () => {
          // Arrange
          const currentDate = new Date();
          const chargerSerialNumber = uuidv4();
          const chargerToAdd = {
            serial_number: chargerSerialNumber,
            batteryLevel: 124.54,
            model: 'copper2',
            batteryType: 'lithium',
            injection: 'triphase',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: true,
            supportedVoltage: 7.4,
            kW: 22,
            joinDate: currentDate.toISOString(),
          };

          const chargerToUpdate = {
            batteryLevel: 890,
            model: 'copper30000',
            batteryType: 'ion',
            injection: 'twophased',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: false,
            supportedVoltage: 10.35,
            kW: 32,
          };

          await createCharger(chargerToAdd);

          // Act
          const putResponse = await axios.put(
            `/charger/${chargerSerialNumber}`,
            chargerToUpdate
          );

          const getResponse = await axios.get(
            `/charger/${chargerSerialNumber}`
          );

          const expectedCharger = {
            ...chargerToUpdate,
            serial_number: chargerSerialNumber,
            joinDate: currentDate.toISOString(),
          };

          // Assert
          expect(putResponse.status).toBe(StatusCodes.OK);
          expect(getResponse.data).toStrictEqual(expectedCharger);
        });
      });

      describe('when updating an unknow charger with the PUT:/:serialNumber route', () => {
        test('then a 404 error is thrown', async () => {
          // Arrange
          const chargerSerialNumber = uuidv4();

          // Act
          const putResponse = await axios.put(
            `/charger/${chargerSerialNumber}`,
            {}
          );

          // Assert
          expect(putResponse.status).toBe(StatusCodes.NOT_FOUND);
        });
      });
    });

    describe('DELETE', () => {
      describe('when deleting an existing charger with the DELETE:/:serialNumber route', () => {
        test('then the charger should not be included', async () => {
          // Arrange
          const currentDate = new Date();
          const chargerSerialNumber = uuidv4();

          const chargerToAdd = {
            serial_number: chargerSerialNumber,
            batteryLevel: 124.54,
            model: 'copper2',
            batteryType: 'lithium',
            injection: 'triphase',
            protectionRating: 'IP55/IK10',
            communicationProtocol: 'myWallbox',
            internetConnection: true,
            supportedVoltage: 7.4,
            kW: 22,
            joinDate: currentDate.toISOString(),
          };

          await createCharger(chargerToAdd);

          console.log('serial1', chargerSerialNumber);

          const deleteResponse = await axios.delete(
            `/charger/${chargerSerialNumber}`
          );

          // Act
          const getResponse = await axios.get(
            `/charger/${chargerSerialNumber}`
          );

          // Assert
          expect(deleteResponse.status).toBe(StatusCodes.OK);
          expect(deleteResponse.data.affected).toBe(1);
          expect(getResponse.status).toBe(StatusCodes.NOT_FOUND);
        });
      });
    });
  });
});
