import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    RelativeDatePipe
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss'
})

export class TaskListItemComponent {

  @Input({ required: true }) task!: TaskRule;

  @Input() isCompleted: boolean = false;

  @Output() statusToggle : EventEmitter<boolean> = new EventEmitter<boolean>();

  private router: Router = inject(Router);

  onStatusChange(event: MatCheckboxChange): void {
    this.statusToggle.emit(event.checked);
  }

  navigateToDetail(): void {
    this.router.navigate(['/tasks/detail', this.task.id]);
  }
}
