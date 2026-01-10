import { Priority, Difficulty, Frequency } from './task-types.entity';

export interface TaskRule {
  id               : string;
  parentRuleId    ?: string;
  userId           : string;

  title            : string;
  description     ?: string;
  tagId           ?: string;
  skillIds        ?: string[];

  priority         : Priority;
  difficulty       : Difficulty;
  xpReward         : number;
  isXpManual       : boolean;

  startDate        : Date;
  endDate         ?: Date;
  instanceEndTime ?: Date;
  frequency        : Frequency;

  createdAt        : Date;
  updatedAt        : Date;
}
