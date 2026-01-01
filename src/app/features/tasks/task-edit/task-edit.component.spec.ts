import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TaskEditComponent } from './task-edit.component';
import { TaskRuleRepository } from '../../../domain/repositories/task-rule.repository';
import { TaskRuleRepositoryImpl } from '../../../infrastructure/repositories/task-rule.repository.impl';

describe('TaskEditComponent', () => {
  let component: TaskEditComponent;
  let fixture: ComponentFixture<TaskEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditComponent],
      providers: [
        { provide: TaskRuleRepository, useClass: TaskRuleRepositoryImpl },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
