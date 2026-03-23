import * as migration_20260323_122011 from './20260323_122011';

export const migrations = [
  {
    up: migration_20260323_122011.up,
    down: migration_20260323_122011.down,
    name: '20260323_122011'
  },
];
