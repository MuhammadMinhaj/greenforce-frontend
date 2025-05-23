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
import { delay, HttpResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import {
  mockDoesMeteringPointExistQuery,
  mockGetAggregatedMeasurementsForMonthQuery,
  mockGetAggregatedMeasurementsForYearQuery,
  mockGetContactCprQuery,
  mockGetMeasurementPointsQuery,
  mockGetMeasurementsQuery,
  mockGetMeteringPointByIdQuery,
  mockGetMeteringPointsByGridAreaQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';
import { MeteringPointSubType, Quality } from '@energinet-datahub/dh/shared/domain/graphql';

import { parentMeteringPoint } from './data/metering-point/parent-metering-point';
import { measurementPoints } from './data/metering-point/measurements-points';
import { meteringPointsByGridAreaCode } from './data/metering-point/metering-points-by-grid-area-code';
import { childMeteringPoint } from './data/metering-point/child-metering-point';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function meteringPointMocks(apiBase: string) {
  return [
    doesMeteringPointExists(),
    getContactCPR(),
    getMeteringPoint(),
    getMeteringPointsByGridArea(),
    getMeasurements(),
    getMeasurementPoints(),
    getAggreatedMeasurementsForMonth(),
    getAggreatedMeasurementsForYear(),
  ];
}

function getAggreatedMeasurementsForYear() {
  return mockGetAggregatedMeasurementsForYearQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        aggregatedMeasurementsForYear: [
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 100,
            date: '2023-01',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Estimated,
            quantity: 150,
            date: '2023-02',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Measured,
            quantity: 200,
            date: '2023-03',
            containsUpdatedValues: true,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: true,
            quality: Quality.Missing,
            quantity: 250,
            date: '2023-04',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 300,
            date: '2023-05',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: true,
            quality: Quality.Calculated,
            quantity: 350,
            date: '2023-06',
            containsUpdatedValues: true,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 400,
            date: '2023-07',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 450,
            date: '2023-08',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: true,
            quality: Quality.Calculated,
            quantity: 500,
            date: '2023-09',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 550,
            date: '2023-10',
            containsUpdatedValues: true,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 600,
            date: '2023-11',
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationByMonthDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 650,
            date: '2023-12',
            containsUpdatedValues: false,
          },
        ],
      },
    });
  });
}

function getAggreatedMeasurementsForMonth() {
  return mockGetAggregatedMeasurementsForMonthQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        aggregatedMeasurementsForMonth: [
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 100,
            date: new Date('2023-01-01T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 150,
            date: new Date('2023-01-02T22:59:59.99999Z'),
            containsUpdatedValues: true,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: true,
            quality: Quality.Calculated,
            quantity: 200,
            date: new Date('2023-01-03T22:59:59.99999Z'),
            containsUpdatedValues: true,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 250,
            date: new Date('2023-01-04T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },

          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 300,
            date: new Date('2023-01-05T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 350,
            date: new Date('2023-01-06T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 400,
            date: new Date('2023-01-07T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 450,
            date: new Date('2023-01-08T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 500,
            date: new Date('2023-01-09T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
          {
            __typename: 'MeasurementAggregationDto',
            missingValues: false,
            quality: Quality.Calculated,
            quantity: 550,
            date: new Date('2023-01-10T22:59:59.99999Z'),
            containsUpdatedValues: false,
          },
        ],
      },
    });
  });
}

function getMeasurements() {
  return mockGetMeasurementsQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        measurements: {
          __typename: 'MeasurementDto',
          measurementPositions: [
            {
              __typename: 'MeasurementPositionDto',
              index: 1,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T23:59:59.99999Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 2,
              hasQuantityOrQualityChanged: true,
              historic: measurementPoints.toSpliced(0, 1),
              observationTime: new Date('2023-01-01T00:00:00Z'),
              current: measurementPoints[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 3,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(0, 1).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T01:00:00Z'),
              current: measurementPoints.toSpliced(0, 1)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 4,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(2, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T02:00:00Z'),
              current: measurementPoints.toSpliced(2, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 5,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(1, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T03:00:00Z'),
              current: measurementPoints.toSpliced(1, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 6,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(1, 4).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T04:00:00Z'),
              current: measurementPoints.toSpliced(1, 4)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 7,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(2, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T05:00:00Z'),
              current: measurementPoints.toSpliced(2, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 8,
              hasQuantityOrQualityChanged: false,
              historic: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T06:00:00Z'),
              current: measurementPoints.toSpliced(0, 3)[0],
            },
            {
              __typename: 'MeasurementPositionDto',
              index: 9,
              hasQuantityOrQualityChanged: true,
              historic: measurementPoints.toSpliced(0, 3).toSpliced(0, 1),
              observationTime: new Date('2023-01-01T07:00:00Z'),
              current: measurementPoints.toSpliced(0, 3)[0],
            },
          ],
        },
      },
    });
  });
}

function getMeasurementPoints() {
  return mockGetMeasurementPointsQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint: {
          __typename: 'MeteringPointDto',
          id: mockMPs[meteringPointId].id,
          metadata: {
            __typename: 'MeteringPointMetadataDto',
            id: mockMPs[meteringPointId].metadataId,
            subType: mockMPs[meteringPointId].subType,
          },
        },
        measurementPoints: [
          measurementPoints[0],
          measurementPoints.toSpliced(0, 1)[0],
          measurementPoints.toSpliced(0, 3)[0],
        ],
      },
    });
  });
}

const mockMPs: {
  [key: string]: {
    id: number;
    meteringPointId: string;
    metadataId: number;
    subType: MeteringPointSubType;
  };
} = {
  [parentMeteringPoint.meteringPointId]: {
    id: parentMeteringPoint.id,
    meteringPointId: parentMeteringPoint.meteringPointId,
    metadataId: parentMeteringPoint.metadata.id,
    subType: parentMeteringPoint.metadata.subType,
  },
  [childMeteringPoint.meteringPointId]: {
    id: childMeteringPoint.id,
    meteringPointId: childMeteringPoint.meteringPointId,
    metadataId: childMeteringPoint.metadata.id,
    subType: childMeteringPoint.metadata.subType,
  },
};

function doesMeteringPointExists() {
  return mockDoesMeteringPointExistQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    if (
      [parentMeteringPoint.meteringPointId, childMeteringPoint.meteringPointId].includes(
        meteringPointId
      )
    ) {
      return HttpResponse.json({
        data: {
          __typename: 'Query',
          meteringPoint: {
            __typename: 'MeteringPointDto',
            id: mockMPs[meteringPointId].id,
            meteringPointId: mockMPs[meteringPointId].meteringPointId,
          },
        },
      });
    }

    return HttpResponse.json({
      data: null,
      errors: [
        {
          message: 'Metering point not found',
          path: ['meteringPoint'],
        },
      ],
    });
  });
}

function getContactCPR() {
  return mockGetContactCprQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointContactCpr: { __typename: 'CPRResponse', result: '1234567890' },
      },
    });
  });
}

function getMeteringPoint() {
  return mockGetMeteringPointByIdQuery(async ({ variables: { meteringPointId } }) => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPoint:
          meteringPointId === parentMeteringPoint.meteringPointId
            ? parentMeteringPoint
            : childMeteringPoint,
      },
    });
  });
}

function getMeteringPointsByGridArea() {
  return mockGetMeteringPointsByGridAreaQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointsByGridAreaCode,
      },
    });
  });
}
