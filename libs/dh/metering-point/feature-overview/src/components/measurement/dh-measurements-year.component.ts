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
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  effect,
  inject,
  input,
  signal,
  computed,
  Component,
  LOCALE_ID,
  ViewEncapsulation,
} from '@angular/core';

import { map, startWith } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import {
  Quality,
  Resolution,
  GetAggregatedMeasurementsForYearDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

import { dayjs, WattSupportedLocales } from '@energinet-datahub/watt/date';
import { WattYearField, YEAR_FORMAT } from '@energinet-datahub/watt/year-field';
import { WattSlideToggleComponent } from '@energinet-datahub/watt/slide-toggle';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhFormatObservationTimePipe } from './dh-format-observation-time.pipe';
import { dhFormatMeasurementNumber } from '../../utils/dh-format-measurement-number';
import {
  AggregatedMeasurementsForYear,
  AggregatedMeasurementsByYearQueryVariables,
} from '../../types';
import { DhCircleComponent } from './circle.component';

@Component({
  selector: 'dh-measurements-year',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_TABLE,
    WattYearField,
    WattDataTableComponent,
    WattSlideToggleComponent,
    WattDataFiltersComponent,

    VaterStackComponent,
    VaterUtilityDirective,

    DhCircleComponent,
    DhFormatObservationTimePipe,
  ],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    dh-measurements-year {
      watt-year-field {
        width: 200px;
      }

      .capitalize {
        text-transform: capitalize;
      }

      .missing-values-text {
        @include watt.typography-watt-text-s;
        color: var(--watt-on-light-medium-emphasis);
      }
    }
  `,
  template: `
    <watt-data-table
      vater
      inset="ml"
      [enableSearch]="false"
      [enableCount]="false"
      [error]="query.error()"
      [ready]="query.called()"
      [enablePaginator]="false"
      *transloco="let t; read: 'meteringPoint.measurements'"
    >
      <watt-data-filters *transloco="let t; read: 'meteringPoint.measurements.filters'">
        <form wattQueryParams [formGroup]="form">
          <vater-stack direction="row" gap="ml" align="baseline">
            <watt-year-field [formControl]="form.controls.year" [max]="maxDate.toDate()" />
            <watt-slide-toggle [formControl]="form.controls.showOnlyChangedValues">
              {{ t('showOnlyChangedValues') }}
            </watt-slide-toggle>
          </vater-stack>
        </form>
      </watt-data-filters>
      <watt-table
        *transloco="let resolveHeader; read: 'meteringPoint.measurements.columns'"
        [resolveHeader]="resolveHeader"
        [columns]="columns"
        [stickyFooter]="true"
        [dataSource]="dataSource"
        [loading]="query.loading()"
        sortDirection="desc"
        [sortClear]="false"
      >
        <ng-container *wattTableCell="columns.month; let element">
          {{ element.date | dhFormatObservationTime: Resolution.Monthly }}
        </ng-container>

        <ng-container *wattTableCell="columns.currentQuantity; let element">
          @if (element.quality === Quality.Estimated) {
            ≈
          }
          {{ formatNumber(element.quantity) }}
        </ng-container>

        <ng-container *wattTableCell="columns.containsUpdatedValues; let element">
          @if (element.containsUpdatedValues) {
            <dh-circle />
          }
        </ng-container>

        <ng-container *wattTableCell="columns.missingValues; let element">
          @if (element.missingValues) {
            <span class="missing-values-text">{{ t('missingValues') }}</span>
          }
        </ng-container>
      </watt-table>
    </watt-data-table>
  `,
})
export class DhMeasurementsYearComponent {
  private locale = inject<WattSupportedLocales>(LOCALE_ID);
  private transloco = inject(TranslocoService);
  private fb = inject(NonNullableFormBuilder);
  private measurements = computed(() => this.query.data()?.aggregatedMeasurementsForYear ?? []);
  private sum = computed(() =>
    this.formatNumber(this.measurements().reduce((acc, x) => acc + x.quantity, 0))
  );
  maxDate = dayjs().subtract(1, 'days');
  form = this.fb.group({
    year: this.fb.control<string>(this.maxDate.format(YEAR_FORMAT)),
    showOnlyChangedValues: this.fb.control(false),
  });
  meteringPointId = input.required<string>();
  query = lazyQuery(GetAggregatedMeasurementsForYearDocument);
  Resolution = Resolution;
  Quality = Quality;

  columns: WattTableColumnDef<AggregatedMeasurementsForYear> = {
    month: {
      accessor: 'date',
      size: 'min-content',
      dataCellClass: 'capitalize',
      footer: { value: signal(this.transloco.translate('meteringPoint.measurements.sum')) },
    },
    currentQuantity: {
      accessor: 'quantity',
      align: 'right',
      footer: { value: this.sum },
    },
    containsUpdatedValues: {
      accessor: 'containsUpdatedValues',
      header: '',
    },
    missingValues: {
      accessor: 'missingValues',
      header: '',
      size: '1fr',
    },
  };

  dataSource = new WattTableDataSource<AggregatedMeasurementsForYear>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.query.data()?.aggregatedMeasurementsForYear ?? [];
    });

    effect(() => {
      this.query.refetch({
        ...this.values(),
        meteringPointId: this.meteringPointId(),
      });
    });
  }

  values = toSignal<AggregatedMeasurementsByYearQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(
        ({ showOnlyChangedValues, year }): AggregatedMeasurementsByYearQueryVariables => ({
          year: parseInt(year),
          showOnlyChangedValues,
        })
      )
    ),
    { requireSync: true }
  );

  formatNumber(value: number) {
    return dhFormatMeasurementNumber(value, this.locale);
  }
}
