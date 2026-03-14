import { FuelHHRecord, WindForRecord } from "./types";
import { addDays, format, parseISO, differenceInCalendarDays } from "date-fns";

const BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1";
const BATCH_DELAY_MS = 150;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchActuals(
  startDate: string,
  endDate: string
): Promise<FuelHHRecord[]> {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const totalDays = differenceInCalendarDays(end, start) + 1;

  const allRecords: FuelHHRecord[] = [];

  for (let i = 0; i < totalDays; i++) {
    const day = format(addDays(start, i), "yyyy-MM-dd");
    const url = `${BASE_URL}/datasets/FUELHH/stream?settlementDateFrom=${day}&settlementDateTo=${day}&fuelType=WIND&format=json`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FUELHH fetch failed for ${day}: ${res.status}`);
      continue;
    }

    const data: FuelHHRecord[] = await res.json();
    allRecords.push(...data);

    if (i < totalDays - 1) await delay(BATCH_DELAY_MS);
  }

  return allRecords.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
}

export async function fetchForecasts(
  startDate: string,
  endDate: string
): Promise<WindForRecord[]> {
  const bufferStart = addDays(parseISO(startDate), -3);
  const end = parseISO(endDate);
  const totalDays = differenceInCalendarDays(end, bufferStart) + 1;

  const allRecords: WindForRecord[] = [];

  for (let i = 0; i < totalDays; i++) {
    const day = addDays(bufferStart, i);
    const from = format(day, "yyyy-MM-dd") + "T00:00:00Z";
    const to = format(day, "yyyy-MM-dd") + "T23:59:59Z";
    const url = `${BASE_URL}/datasets/WINDFOR/stream?publishDateTimeFrom=${from}&publishDateTimeTo=${to}&format=json`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`WINDFOR fetch failed for ${format(day, "yyyy-MM-dd")}: ${res.status}`);
      continue;
    }

    const data: WindForRecord[] = await res.json();
    allRecords.push(...data);

    if (i < totalDays - 1) await delay(BATCH_DELAY_MS);
  }

  return allRecords;
}
