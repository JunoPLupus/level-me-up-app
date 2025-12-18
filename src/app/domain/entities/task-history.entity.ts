import { TaskStatus } from './task-types.entity';

export interface TaskHistory {
  id                : string;
  userId            : string;
  ruleId           ?: string;

  registryDate      : Date;

  status            : TaskStatus;

  snapshotTitle     : string;
  snapshotXp        : number;
  snapshotTagId    ?: string;
  snapshotSkillIds ?: string[];
}
