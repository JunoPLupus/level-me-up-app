export interface TaskException {
  id              : string;
  ruleId          : string;
  originalDate    : Date;

  newTitle       ?: string;
  newDescription ?: string;
  newXp          ?: number;
  newDate        ?: Date;

  isDeleted      ?: boolean;
  isCompleted    ?: boolean;
}
