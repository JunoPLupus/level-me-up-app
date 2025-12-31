import { Component, EventEmitter, Input, OnInit, Output, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule} from '@angular/material/slider';

import { TaskRule } from '../../../domain/entities/task-rule.entity';
import { Priority, Frequency, TaskFormOutput, Difficulty } from '../../../domain/entities/task-types.entity';
import { dateRangeValidator } from '../../../shared/validators/date-range.validator';
import {
  FREQUENCY_OPTIONS,
  getSliderValueFromPriority,
  PRIORITY_UI_CONFIG
} from '../../../shared/utils/task-ui.constants';
import { formatTimeForInput } from '../../../shared/utils/date.utils';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})

export class TaskFormComponent implements OnInit {

  @Input() task?: TaskRule;
  @Output() save : EventEmitter<TaskFormOutput> = new EventEmitter<TaskFormOutput>();

  private formBuilder : FormBuilder = inject(FormBuilder);
  private locationService : Location = inject(Location);

  readonly frequencyOptions = FREQUENCY_OPTIONS;

  taskForm!: FormGroup;
  isEditMode : boolean = false;
  showAdvanced : WritableSignal<boolean> = signal(false);

  // Mock de Tags (@TODO remover quando tiver TagFacade)
  tags = [
    { id: 'tag-1', name: 'Estudos' },
    { id: 'tag-2', name: 'Trabalho' },
    { id: 'tag-3', name: 'Casa' }
  ];

  ngOnInit(): void {
    this.isEditMode = !!this.task;
    if (this.isEditMode) {
      this.showAdvanced.set(true);
    }
    this.initForm();
  }

  private initForm(): void {

    const sliderValue = this.task
      ? getSliderValueFromPriority(this.task.priority)
      : 1;

    const initialStartTime = formatTimeForInput(this.task?.startDate || new Date());

    this.taskForm = this.formBuilder.group({
      title: [this.task?.title || '', Validators.required],
      tagId: [this.task?.tagId || '', Validators.required],
      description: [this.task?.description || ''],

      priority: [sliderValue, Validators.required],

      startDate: [this.task?.startDate || new Date(), Validators.required],
      startTime: [initialStartTime, Validators.required],

      endDate: [this.task?.endDate || null],
      endTime: [formatTimeForInput(this.task?.endDate)],

      frequency: [this.task?.frequency || Frequency.NONE, Validators.required],

      keepAdding: [false]
    }, {
      validators: dateRangeValidator()
    });
  }

  getPriorityLabel(sliderValue: number): string {
    return PRIORITY_UI_CONFIG[sliderValue as keyof typeof PRIORITY_UI_CONFIG]?.label || 'Baixa';
  }

  goBack(): void {
    this.locationService.back();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;
    const formValue = this.taskForm.value;

    const startDate = new Date(formValue.startDate);
    const [startHours, startMinutes] = formValue.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes);

    let endDate: Date | undefined = undefined;
    if (formValue.endDate) {
      endDate = new Date(formValue.endDate);
      if (formValue.endTime) {
        const [endHours, endMinutes] = formValue.endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes);
      } else {
        endDate.setHours(23, 59);
      }
    }

    const priorityEnum = this.getPriorityConfig(formValue.priority)?.value || Priority.LOW;


    const output: TaskFormOutput = {
      id: this.task?.id,
      title: formValue.title,
      description: formValue.description,
      tagId: formValue.tagId,
      priority: priorityEnum,
      frequency: formValue.frequency,
      startDate: startDate,
      endDate: endDate,
      instanceEndTime: undefined,

      difficulty: this.task?.difficulty || Difficulty.EASY,
      xpReward: this.task?.xpReward || 10, // @TODO Alterar esse '10' depois que tivermos a 'calculadora de xp'
      isXpManual: this.task?.isXpManual || false,
      skillIds: this.task?.skillIds || [],

      keepAdding: formValue.keepAdding
    };

    this.save.emit(output);

    if (formValue.keepAdding) {
      this.resetFormKeepAdding();
    }
  }

  private getPriorityConfig(sliderValue: number) {
    return PRIORITY_UI_CONFIG[sliderValue as keyof typeof PRIORITY_UI_CONFIG];
  }

  private resetFormKeepAdding() : void {
    this.taskForm.reset({
      title: '',
      description: '',
      tagId: this.taskForm.get('tagId')?.value,
      priority: 1,
      startDate: new Date(),
      startTime: formatTimeForInput(new Date()),

      frequency: Frequency.NONE,
      keepAdding: true
    });

    Object.keys(this.taskForm.controls).forEach(key => {
      this.taskForm.get(key)?.setErrors(null);
    });
  }

}
