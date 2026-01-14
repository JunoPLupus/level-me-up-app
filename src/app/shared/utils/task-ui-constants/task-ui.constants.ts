import { Priority, Frequency } from '../../../domain/entities/task-types.entity';

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  [Frequency.NONE]: 'Nenhuma',
  [Frequency.DAILY]: 'Diária',
  [Frequency.WEEKLY]: 'Semanal',
  [Frequency.MONTHLY]: 'Mensal'
};

export const FREQUENCY_OPTIONS =
  Object.entries(FREQUENCY_LABELS)
    .map(([value, label]) => ({
          value: value as Frequency,
          label
}));

export const PRIORITY_UI_CONFIG = {
  1: { value: Priority.LOW, label: 'Baixa' },
  2: { value: Priority.MEDIUM, label: 'Média' },
  3: { value: Priority.HIGH, label: 'Alta' }
};

export function getSliderValueFromPriority(priority: Priority): number {
  const entry =
    Object.entries(PRIORITY_UI_CONFIG)
      .find(([_, config]) => config.value === priority);
  return entry ? Number(entry[0]) : 1;
}
