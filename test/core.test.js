import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAge } from '../src/index.js';

test('same date gives zero age', () => {
  const birth = new Date(2000, 0, 15);
  const ref = new Date(2000, 0, 15);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 0, days: 0 });
});

test('one day after birth', () => {
  const birth = new Date(2000, 0, 15);
  const ref = new Date(2000, 0, 16);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 0, days: 1 });
});

test('one month after birth on same day', () => {
  const birth = new Date(2000, 0, 15);
  const ref = new Date(2000, 1, 15);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 1, days: 0 });
});

test('one year after birth on same day', () => {
  const birth = new Date(2000, 0, 15);
  const ref = new Date(2001, 0, 15);
  assert.deepEqual(calculateAge(birth, ref), { years: 1, months: 0, days: 0 });
});

test('birthday not yet reached in reference year', () => {
  const birth = new Date(2000, 5, 15);
  const ref = new Date(2001, 4, 15);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 11, days: 0 });
});

test('birthday reached in reference year', () => {
  const birth = new Date(2000, 5, 15);
  const ref = new Date(2001, 5, 15);
  assert.deepEqual(calculateAge(birth, ref), { years: 1, months: 0, days: 0 });
});

test('month-end edge: born 31 Jan, reference 28 Feb (non-leap)', () => {
  const birth = new Date(2001, 0, 31);
  const ref = new Date(2001, 1, 28);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 1, days: 0 });
});

test('month-end edge: born 31 Jan, reference 1 Mar (non-leap)', () => {
  const birth = new Date(2001, 0, 31);
  const ref = new Date(2001, 2, 1);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 1, days: 1 });
});

test('month-end edge: born 31 Jan, reference 29 Feb (leap)', () => {
  const birth = new Date(2020, 0, 31);
  const ref = new Date(2020, 1, 29);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 1, days: 0 });
});

test('month-end edge: born 31 Jan, reference 28 Feb (leap year)', () => {
  const birth = new Date(2020, 0, 31);
  const ref = new Date(2020, 1, 28);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 0, days: 28 });
});

test('month-end edge: born 31 Mar, reference 30 Apr', () => {
  const birth = new Date(2020, 2, 31);
  const ref = new Date(2020, 3, 30);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 1, days: 0 });
});

test('month-end edge: born 31 Mar, reference 1 May', () => {
  const birth = new Date(2020, 2, 31);
  const ref = new Date(2020, 4, 1);
  assert.deepEqual(calculateAge(birth, ref), { years: 0, months: 1, days: 1 });
});

test('month-end edge: born 29 Feb, reference 28 Feb next year (non-leap)', () => {
  const birth = new Date(2020, 1, 29);
  const ref = new Date(2021, 1, 28);
  assert.deepEqual(calculateAge(birth, ref), { years: 1, months: 0, days: 0 });
});

test('month-end edge: born 29 Feb, reference 1 Mar next year (non-leap)', () => {
  const birth = new Date(2020, 1, 29);
  const ref = new Date(2021, 2, 1);
  assert.deepEqual(calculateAge(birth, ref), { years: 1, months: 0, days: 1 });
});

test('throws TypeError for invalid birth date', () => {
  assert.throws(() => calculateAge(new Date('invalid'), new Date()), TypeError);
});

test('throws TypeError for invalid reference date', () => {
  assert.throws(() => calculateAge(new Date(), new Date('invalid')), TypeError);
});

test('throws RangeError when reference is before birth', () => {
  const birth = new Date(2000, 0, 1);
  const ref = new Date(1999, 11, 31);
  assert.throws(() => calculateAge(birth, ref), RangeError);
});
