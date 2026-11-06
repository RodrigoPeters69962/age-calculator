# age-calculator

Computes the exact age in years, months, and days between a birth date and a reference date, correctly handling month-end edge cases.

## Usage

```js
import { calculateAge } from './src/index.js';

const birth = new Date(1990, 0, 31); // 31 January 1990
const ref = new Date(2020, 1, 29);   // 29 February 2020

const age = calculateAge(birth, ref);
console.log(age); // { years: 30, months: 1, days: 0 }
```

The function takes two `Date` objects: the birth date and the reference date. It returns an object with `years`, `months`, and `days` properties.

## Why this library exists

Computing an age in years, months, and days is not a simple division of milliseconds. Months have different lengths, so a duration in days does not map uniquely to years and months. The specific problem is the month-end edge case: if you are born on the 31st of a month and the reference date is in a shorter month, how many months old are you?

This library makes one clear decision: when the reference day is the last day of its month, and the birth day is greater than the reference day, the month is considered complete. This means that someone born on 31 January is 1 month old on 29 February (in a leap year) and also 1 month old on 28 February (in a non-leap year), because 28 February is the last day of that month and the birth day (31) is greater. If the reference day is not the last day of the month, the usual borrow rule applies: the number of days in the birth month is added to the negative day difference.

## Edge cases

The awkward edge is a birth on the 29th, 30th, or 31st of a month when the reference month is shorter. The rule above resolves it consistently. Another edge is a birth on 29 February: on 28 February of a non-leap year, the rule makes the age exactly one year, not 11 months and 30 days. This is a deliberate choice; other libraries may differ.
