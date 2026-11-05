/**
 * Computes the exact age between a birth date and a reference date.
 *
 * The result is expressed in whole years, months, and days. The algorithm
 * borrows from the calendar arithmetic used by `dateutil.relativedelta`:
 * it first counts whole years, then whole months, then leftover days.
 *
 * Why this is not simply `(ref - birth) / msPerDay` divided into years:
 * months have different lengths, so a duration in days does not map
 * uniquely to years and months. For example, from 2020-01-31 to
 * 2020-02-29 is 29 days, but it is also "1 month" in the colloquial sense
 * because the end of February is the closest available date to the 31st.
 *
 * We resolve that ambiguity with one clear rule: when the reference day
 * is the last day of its month, and the birth day is greater than the
 * reference day, the month is considered complete. This matches the
 * behaviour of most age calculators for the common case of a birth on the
 * 31st and a reference in a shorter month (e.g. born 31 Jan, on 29 Feb
 * you are 1 month and 0 days old).
 *
 * @param {Date} birth - The date of birth. Must be a valid Date.
 * @param {Date} reference - The date at which to compute the age. Must be a valid Date and not before `birth`.
 * @returns {{ years: number, months: number, days: number }} The exact age.
 * @throws {TypeError} If either argument is not a valid Date object.
 * @throws {RangeError} If `reference` is before `birth`.
 */
export function calculateAge(birth, reference) {
  if (!(birth instanceof Date) || Number.isNaN(birth.getTime())) {
    throw new TypeError('birth must be a valid Date');
  }
  if (!(reference instanceof Date) || Number.isNaN(reference.getTime())) {
    throw new TypeError('reference must be a valid Date');
  }
  if (reference < birth) {
    throw new RangeError('reference must not be before birth');
  }

  let years = reference.getFullYear() - birth.getFullYear();
  let months = reference.getMonth() - birth.getMonth();
  let days = reference.getDate() - birth.getDate();

  // If the day-of-month has not been reached yet, borrow a month.
  // We add the number of days in the birth month, not the month before
  // the reference month, because that is the number of days that have
  // elapsed since the start of the birth month. This is the standard
  // approach used by relativedelta and avoids negative day counts.
  if (days < 0) {
    months -= 1;
    days += daysInMonth(birth.getFullYear(), birth.getMonth());
  }

  // If the month-of-year has not been reached yet, borrow a year.
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Edge case: if the reference is the last day of its month and the
  // birth day is greater than the reference day, we consider the month
  // complete. This handles births on the 29th, 30th, or 31st when the
  // reference month is shorter.
  if (
    days > 0 &&
    reference.getDate() === daysInMonth(reference.getFullYear(), reference.getMonth()) &&
    birth.getDate() > reference.getDate()
  ) {
    days = 0;
    months += 1;
    if (months === 12) {
      years += 1;
      months = 0;
    }
  }

  return { years, months, days };
}

/**
 * Returns the number of days in a given month.
 * @param {number} year - The full year.
 * @param {number} month - The zero-based month (0 = January).
 * @returns {number} The number of days in the month.
 */
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
