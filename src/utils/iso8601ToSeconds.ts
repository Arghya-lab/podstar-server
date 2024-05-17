import { DateTime } from "luxon";

export default function iso8601ToSeconds(iso8601Str: string) {
  // Parse the ISO 8601 timestamp using Luxon
  const dt = DateTime.fromISO(iso8601Str, { zone: "utc" });

  // Calculate the total number of seconds since the Unix epoch
  return Math.floor(dt.toSeconds());
}
