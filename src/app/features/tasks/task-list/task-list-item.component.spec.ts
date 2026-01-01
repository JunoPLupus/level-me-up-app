import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListItemComponent } from './task-list-item.component';
import {Difficulty, Frequency, Priority} from '../../../domain/entities/task-types.entity';

describe('TaskListItemComponent', () => {
  let component: TaskListItemComponent;
  let fixture: ComponentFixture<TaskListItemComponent>;

  const mockTask = {
    id: '1',
    userId: '1',
    title: 'Teste Unitário',
    description: 'Testando componente',
    priority: Priority.HIGH,
    difficulty: Difficulty.HARD,
    frequency: Frequency.NONE,
    xpReward: 50,
    isXpManual: false,
    startDate: new Date(),
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskListItemComponent);
    component = fixture.componentInstance;

    component.task = mockTask as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
