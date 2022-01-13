import { Client, QueryResult } from 'pg';

function createClient(): Client {
  return new Client({
    host: 'localhost',
    port: 5432,
    user: 'thor',
    password: 'root',
    database: 'wallbox',
  });
}

export async function getMigrations(): Promise<QueryResult<any>> {
  const client = createClient();
  await client.connect();
  const res = await client.query('SELECT * FROM "migrations";');
  client.end();

  return res;
}

export async function truncateTable(table: string): Promise<void> {
  const client = createClient();
  await client.connect();
  client.query(`TRUNCATE TABLE ${table} CASCADE;`, (err) => {
    if (err) {
      console.log(err);
    }
    client.end();
  });
}

const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function onQueryErrorCallback(client, err) {
  if (err) {
    console.log(err);
  }
  client.end();
}

export async function waitForPostgres(
  DEFAULT_MAX_ATTEMPTS = 20,
  DEFAULT_DELAY = 150
): Promise<void> {
  let didConnect = false;
  let retries = 0;
  while (!didConnect) {
    try {
      const client = createClient();
      await client.connect();
      console.log('✅ Postgres is ready to accept connections');
      client.end();
      didConnect = true;
    } catch (error) {
      retries += 1;
      if (retries > DEFAULT_MAX_ATTEMPTS) {
        throw error;
      }
      console.log('😴 Postgres is unavailable - sleeping');
      await timeout(DEFAULT_DELAY);
    }
  }
}

export async function createCharger(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  charger: any
): Promise<void> {
  const client = createClient();
  await client.connect();

  client.query(
    `INSERT INTO charger (serial_number, battery_level, model, battery_type, injection, protection_rating, communication_protocol, internet_connection, supported_voltage, kw, join_date) VALUES ('${charger.serial_number}', '${charger.batteryLevel}', '${charger.model}', '${charger.batteryType}', '${charger.injection}', '${charger.protectionRating}', '${charger.communicationProtocol}', '${charger.internetConnection}', '${charger.supportedVoltage}', '${charger.kW}', '${charger.joinDate}');`,
    (err) => onQueryErrorCallback(client, err)
  );
}
