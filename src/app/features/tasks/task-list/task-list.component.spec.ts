import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideRouter } from '@angular/router';

import { TaskListComponent } from './task-list.component';
import { TaskRuleRepository } from '../../../domain/repositories/task-rule.repository';
import { TaskRuleRepositoryImpl } from '../../../infrastructure/repositories/task-rule.repository.impl';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
      { provide: TaskRuleRepository, useClass: TaskRuleRepositoryImpl },
        provideRouter([]),
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
