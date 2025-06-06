//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WattYearField } from './watt-year-field.component';
import { WattDateAdapter } from '../core/date/watt-date-adapter';

const meta: Meta<WattYearField> = {
  title: 'Components/YearField',
  component: WattYearField,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule],
    }),
    applicationConfig({
      providers: [
        { provide: DateAdapter, useClass: WattDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
      ],
    }),
  ],
};

export default meta;

export const Overview: StoryFn = () => ({
  props: { yearOfEmployment: new FormControl<string | null>('2022') },
  template: `
    <watt-year-field
      label="Year of employment"
      [formControl]="yearOfEmployment"
    />
  `,
});
