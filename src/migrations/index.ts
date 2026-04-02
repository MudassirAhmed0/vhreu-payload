import * as migration_20260323_122011 from './20260323_122011';
import * as migration_20260324_115500 from './20260324_115500';
import * as migration_20260402_075211 from './20260402_075211';
import * as migration_20260402_080242 from './20260402_080242';
import * as migration_20260402_081801 from './20260402_081801';

export const migrations = [
  {
    up: migration_20260323_122011.up,
    down: migration_20260323_122011.down,
    name: '20260323_122011',
  },
  {
    up: migration_20260324_115500.up,
    down: migration_20260324_115500.down,
    name: '20260324_115500',
  },
  {
    up: migration_20260402_075211.up,
    down: migration_20260402_075211.down,
    name: '20260402_075211',
  },
  {
    up: migration_20260402_080242.up,
    down: migration_20260402_080242.down,
    name: '20260402_080242',
  },
  {
    up: migration_20260402_081801.up,
    down: migration_20260402_081801.down,
    name: '20260402_081801'
  },
];
