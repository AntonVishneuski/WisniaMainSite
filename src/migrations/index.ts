import * as migration_20260610_120323_initial from './20260610_120323_initial';

export const migrations = [
  {
    up: migration_20260610_120323_initial.up,
    down: migration_20260610_120323_initial.down,
    name: '20260610_120323_initial'
  },
];
