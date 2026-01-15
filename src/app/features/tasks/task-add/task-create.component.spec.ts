import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TaskCreateComponent } from './task-create.component';
import { TaskRuleRepository } from '../../../domain/repositories/task-rule.repository';
import { TaskRuleRepositoryImpl } from '../../../infrastructure/repositories/task-rule.repository.impl';

describe('TaskAddComponent', () => {
  let component: TaskCreateComponent;
  let fixture: ComponentFixture<TaskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent],
      providers: [
        { provide: TaskRuleRepository, useClass: TaskRuleRepositoryImpl },
        provideRouter([]),
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
