import { test, expect } from '@playwright/test';
import { BookingApi } from '../../src/api/BookingApi';
import { newBooking, updatedBooking } from '../../src/data/booking';
import { required } from '../../src/utils/env';

test.use({
  baseURL: 'https://restful-booker.herokuapp.com',
  extraHTTPHeaders: { Accept: 'application/json' },
});

test.describe('Booking API', () => {
  let api: BookingApi;

  test.beforeEach(({ request }) => {
    api = new BookingApi(request);
  });

  test('creates a booking', async () => {
    const response = await api.createBooking(newBooking);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toBeGreaterThan(0);
    expect(body.booking).toMatchObject(newBooking);
  });

  test('gets a booking by id', async () => {
    const created = await (await api.createBooking(newBooking)).json();

    const response = await api.getBooking(created.bookingid);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(newBooking);
  });

  test('updates a booking with a valid token', async () => {
    const created = await (await api.createBooking(newBooking)).json();
    const token = await api.createToken(required('BOOKER_USER'), required('BOOKER_PASSWORD'));

    const response = await api.updateBooking(created.bookingid, updatedBooking, token);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(updatedBooking);
  });

  test('deletes a booking with a valid token', async () => {
    const created = await (await api.createBooking(newBooking)).json();
    const token = await api.createToken(required('BOOKER_USER'), required('BOOKER_PASSWORD'));

    const response = await api.deleteBooking(created.bookingid, token);
    expect(response.status()).toBe(201); // Restful Booker returns 201 for delete

    const after = await api.getBooking(created.bookingid);
    expect(after.status()).toBe(404);
  });

  test('rejects delete without a token', async () => {
    const created = await (await api.createBooking(newBooking)).json();

    const response = await api.deleteBooking(created.bookingid);

    expect(response.status()).toBe(403);
  });
});