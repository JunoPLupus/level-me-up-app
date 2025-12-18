import { UserLevelInfo } from './user-level-info.entity';
import { LevelConfiguration } from './level-configuration.entity';

export interface User {
  uid                 : string;
  displayName         : string;
  email               : string;
  photoUrl           ?: string;

  levelInfo           : UserLevelInfo;
  levelConfiguration  : LevelConfiguration;
  skillIds           ?: string[];
}
