import * as TextUtils from '../../utils/text.utils';
import * as DateUtils from '../../utils/date.utils';
import { TaskRule } from '../../entities/task-rule.entity';

export class TaskValidator {
  static validate(task: TaskRule) {

    if (TextUtils.isEmpty(task.title)) {
      throw new Error("O título é obrigatório.");
    }

    if (!DateUtils.isValid(task.startDate)) {
      throw new Error("Data de início inválida.");
    }

    if (task.endDate && !DateUtils.isValidRange(task.startDate,task.endDate)) {
      throw new Error("O início não pode ser depois que o fim.")
    }
  }
}
