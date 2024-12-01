import { differenceInHours, format, formatDistanceToNow } from "date-fns"

export function formatDate(dateString: string) {
  const date = new Date(dateString)

  // Use relative format for dates within 24 hours, else fallback to standard format
  if (differenceInHours(new Date(), date) < 24) {
    return formatDistanceToNow(date, { addSuffix: true }) // e.g., "5 hours ago"
  } else {
    return format(date, "PPP p") // e.g., "Jan 1, 2023 at 5:00 PM"
  }
}
