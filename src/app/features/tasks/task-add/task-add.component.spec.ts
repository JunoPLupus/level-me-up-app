import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

import { TaskAddComponent } from './task-add.component';
import { TaskRuleRepository } from '../../../domain/repositories/task-rule.repository';
import { TaskRuleRepositoryImpl } from '../../../infrastructure/repositories/task-rule.repository.impl';

describe('TaskAddComponent', () => {
  let component: TaskAddComponent;
  let fixture: ComponentFixture<TaskAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAddComponent],
      providers: [
        { provide: TaskRuleRepository, useClass: TaskRuleRepositoryImpl },
        provideRouter([]),
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
