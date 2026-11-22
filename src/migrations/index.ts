import * as migration_20261122_090511_initial from './20261122_090511_initial';

export const migrations = [
  {
    up: migration_20261122_090511_initial.up,
    down: migration_20261122_090511_initial.down,
    name: '20261122_090511_initial'
  },
];
