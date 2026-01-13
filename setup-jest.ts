import 'jest-preset-angular/setup-env/zone';

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

global.fetch = jest.fn();

global.Response = class {
  ok = true;
  status = 200;
  json() { return Promise.resolve({}); }
  text() { return Promise.resolve(''); }
  clone() { return this; }
} as any;

global.Request = class {} as any;
global.Headers = class {} as any;

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
