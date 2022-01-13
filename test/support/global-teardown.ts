import path from 'path';
import npm from 'npm';
import util from 'util';
import * as dockerCompose from 'docker-compose';
import { getMigrations } from '../test-helpers';
import isCI from 'is-ci';

export default async function tearDown(): Promise<void> {
  if (process.env.noInfrastructure) {
    return;
  }

  // ✋🏻 Run migrations revert only on CI env
  if (process.env.DO_Migrations || isCI) {
    // ⏮ DB migrations revert
    const migrations = await getMigrations();

    const npmLoadAsPromise = util.promisify(npm.load);
    await npmLoadAsPromise();
    const npmCommandAsPromise = util.promisify(npm.commands['run-script']);

    const migrationsToRun = [];
    for (let migration = 0; migration < migrations.rowCount; migration += 1) {
      migrationsToRun.push(
        npmCommandAsPromise(['typeorm', 'migration:revert']),
      );
    }

    await Promise.all(migrationsToRun);

    // ✋🏻 Stop docker container
    await dockerCompose.down({
      cwd: path.join(path.dirname(__filename), './docker'),
      log: true,
    });
  }
}
