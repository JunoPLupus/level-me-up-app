import { TaskRule } from './task-rule.entity';

export const TaskStatus = {
  PENDING    : 'PENDING',
  COMPLETED  : 'COMPLETED',
  FAILED     : 'FAILED',
  SKIPPED    : 'SKIPPED'
} as const;

export const Priority = {
  LOW        : 'LOW',
  MEDIUM     : 'MEDIUM',
  HIGH       : 'HIGH'
} as const;

export const Difficulty = {
  EASY       : 'EASY',
  MEDIUM     : 'MEDIUM',
  HARD       : 'HARD'
} as const;

export const Frequency = {
  NONE       : 'NONE',
  DAILY      : 'DAILY',
  WEEKLY     : 'WEEKLY',
  MONTHLY    : 'MONTHLY'
} as const;

export type Priority = typeof Priority[keyof typeof Priority];
export type Difficulty = typeof Difficulty[keyof typeof Difficulty];
export type Frequency = typeof Frequency[keyof typeof Frequency];
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export type TaskFormOutput = Omit<TaskRule, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'isDeleted'> & {
  id        ?: string;
  keepAdding : boolean;
};
