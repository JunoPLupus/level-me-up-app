import { Priority, Frequency } from '../../../domain/entities/task-types.entity';
import { Tag } from '../../../domain/entities/tag.entity';

// @TODO: Remover essa mock depois de ter uma API real para tags
export const MOCK_TAGS: Tag[] = [
  {
    id: 'tag-1',
    userId: 'mock-user',
    name: 'Estudos',
    colorHex: '#3F51B5'
  },
  {
    id: 'tag-2',
    userId: 'mock-user',
    name: 'Trabalho',
    colorHex: '#FF9800'
  },
  {
    id: 'tag-3',
    userId: 'mock-user',
    name: 'Casa',
    colorHex: '#4CAF50'
  },
  {
    id: 'tag-4',
    userId: 'mock-user',
    name: 'Saúde',
    colorHex: '#F44336'
  }
];

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

export function getTagName(tagId: string): string {
  const tag = MOCK_TAGS.find(tag => tag.id === tagId)?.name;
  return tag ? tag : 'Others';
}

export function getTagColor(tagId: string): string {
  const tag = MOCK_TAGS.find(tag => tag.id === tagId);
  return tag ? tag.colorHex : '#808080';
}
