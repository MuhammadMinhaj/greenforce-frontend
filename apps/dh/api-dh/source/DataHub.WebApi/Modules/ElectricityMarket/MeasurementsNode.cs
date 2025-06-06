// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Energinet.DataHub.Measurements.Abstractions.Api.Models;
using Energinet.DataHub.Measurements.Abstractions.Api.Queries;
using Energinet.DataHub.Measurements.Client;
using Energinet.DataHub.WebApi.Modules.ElectricityMarket.Models;
using HotChocolate.Authorization;
using NodaTime;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket;

public static partial class MeasurementsNode
{
    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationDto>> GetAggregatedMeasurementsForMonthAsync(
        bool showOnlyChangedValues,
        GetAggregatedByMonthQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var measurements = await client.GetAggregatedByMonth(query, ct);

        if (showOnlyChangedValues)
        {
            return measurements.Where(x => x.ContainsUpdatedValues);
        }

        return measurements;
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementAggregationByMonthDto>> GetAggregatedMeasurementsForYearAsync(
        bool showOnlyChangedValues,
        GetAggregatedByYearQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var measurements = new[]
        {
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 1),
            233.0m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: true,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 2),
            210.5m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: true),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 3),
            245.2m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: true,
            ContainsUpdatedValues: true),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 4),
            228.7m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 5),
            251.3m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 6),
            270.8m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 7),
            285.1m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 8),
            276.9m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 9),
            256.4m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 10),
            241.7m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 11),
            229.2m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
            new MeasurementAggregationByMonthDto(
            new YearMonth(2023, 12),
            238.5m,
            Quality.Calculated,
            Unit.MVAr,
            MissingValues: false,
            ContainsUpdatedValues: false),
        };

        if (showOnlyChangedValues)
        {
            return await Task.FromResult(measurements.Where(x => x.ContainsUpdatedValues));
        }

        return await Task.FromResult(measurements);
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<MeasurementDto> GetMeasurementsAsync(
        bool showOnlyChangedValues,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client)
    {
        var measurements = await client.GetByDayAsync(query, ct);

        var updatedPositions = measurements.MeasurementPositions.Select(position =>
            new MeasurementPositionDto(
                position.Index,
                position.ObservationTime,
                position.MeasurementPoints
                    .GroupBy(p => p.Quantity)
                    .Select(g => g.First())));

        measurements = new MeasurementDto(updatedPositions);

        if (showOnlyChangedValues)
        {
            var measurementPositions = measurements.MeasurementPositions
                .Where(position => position.MeasurementPoints
                    .Select(p => p.Quantity)
                    .Distinct()
                    .Count() > 1);

            return new MeasurementDto(measurementPositions);
        }

        return measurements;
    }

    [Query]
    [Authorize(Roles = new[] { "metering-point:search" })]
    public static async Task<IEnumerable<MeasurementPointDto>> GetMeasurementPointsAsync(
        int index,
        GetByDayQuery query,
        CancellationToken ct,
        [Service] IMeasurementsClient client) => (await client.GetByDayAsync(query, ct))
            .MeasurementPositions
            .Where(position => position.Index == index)
            .SelectMany(position => position.MeasurementPoints);
}
