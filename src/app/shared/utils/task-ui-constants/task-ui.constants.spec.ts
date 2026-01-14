import { FREQUENCY_OPTIONS, getSliderValueFromPriority, PRIORITY_UI_CONFIG } from './task-ui.constants';
import {Frequency, Priority} from '../../../domain/entities/task-types.entity';

describe('TaskUiConstants', () => {

    it('should return Nenhuma for NONE frequency label', () => {
      const frequency = FREQUENCY_OPTIONS
        .find(opt => opt.value === Frequency.NONE);

      expect(frequency?.label).toBe('Nenhuma');
    });

    it('should return Diária for DAILY frequency label', () => {
      const frequency = FREQUENCY_OPTIONS
        .find(opt => opt.value === Frequency.DAILY);

      expect(frequency?.label).toBe('Diária');
    });

    it('should return Semanal for WEEKLY frequency label', () => {
      const frequency = FREQUENCY_OPTIONS
        .find(opt => opt.value === Frequency.WEEKLY);

      expect(frequency?.label).toBe('Semanal');
    });

    it('should return Mensal for MONTHLY frequency label', () => {
      const frequency = FREQUENCY_OPTIONS
        .find(opt => opt.value === Frequency.MONTHLY);

      expect(frequency?.label).toBe('Mensal');
    });

    it('should return Baixa for LOW label', () => {
      const priority = Object.values(PRIORITY_UI_CONFIG)
        .find(config => config.value === Priority.LOW);

      expect(priority?.label).toBe('Baixa');
    });

    it('should return Média for MEDIUM label', () => {
      const priority = Object.values(PRIORITY_UI_CONFIG)
        .find(config => config.value === Priority.MEDIUM);

      expect(priority?.label).toBe('Média');
    });

    it('should return Alta for HIGH label', () => {
      const priority = Object.values(PRIORITY_UI_CONFIG)
        .find(config => config.value === Priority.HIGH);

      expect(priority?.label).toBe('Alta');
    });

    it('should return 1 for LOW priority', () => {
      const prioritySliderValue = getSliderValueFromPriority(Priority.LOW);
      expect(prioritySliderValue).toBe(1);
    });

    it('should return 2 for MEDIUM priority', () => {
      const prioritySliderValue = getSliderValueFromPriority(Priority.MEDIUM);
      expect(prioritySliderValue).toBe(2);
    });

    it('should return 3 for HIGH priority', () => {
      const prioritySliderValue = getSliderValueFromPriority(Priority.HIGH);
      expect(prioritySliderValue).toBe(3);
    });

  it('should return 1 if received invalid entry value', () => {
    const prioritySliderValue = getSliderValueFromPriority(5 as unknown as Priority);
    expect(prioritySliderValue).toBe(1);
  });
});
