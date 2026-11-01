import { type Booking } from '../api/BookingApi';

export const newBooking: Booking = {
  firstname: 'Amanda',
  lastname: 'Tester',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

export const updatedBooking: Booking = {
  ...newBooking,
  totalprice: 300,
  additionalneeds: 'Late checkout',
};
