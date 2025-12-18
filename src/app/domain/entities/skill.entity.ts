import { UserLevelInfo } from './user-level-info.entity';

export interface Skill {
  id           : string;
  userId       : string;
  name         : string;
  icon        ?: string;
  description ?: string;

  levelInfo    : UserLevelInfo;
}
