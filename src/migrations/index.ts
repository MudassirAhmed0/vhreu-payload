import * as migration_20260323_122011 from './20260323_122011';
import * as migration_20260324_115500 from './20260324_115500';

export const migrations = [
  {
    up: migration_20260323_122011.up,
    down: migration_20260323_122011.down,
    name: '20260323_122011'
  },
  {
    up: migration_20260324_115500.up,
    down: migration_20260324_115500.down,
    name: '20260324_115500'
  },
];
