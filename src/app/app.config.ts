import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { routes } from './app.routes';
import { TaskRuleRepository } from './domain/repositories/task-rule.repository';
import { TaskRuleRepositoryImpl } from './infrastructure/repositories/task-rule.repository.impl';

import { environment } from '../environments/environment.development';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),

    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: TaskRuleRepository, useClass: TaskRuleRepositoryImpl }
  ]
};
