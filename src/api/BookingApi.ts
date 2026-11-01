import { type APIRequestContext, type APIResponse } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

export class BookingApi {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(username: string, password: string): Promise<string> {
    const response = await this.request.post('/auth', { data: { username, password } });
    const body = await response.json();
    if (!body.token) {
      throw new Error(`Login failed: ${JSON.stringify(body)}`);
    }
    return body.token;
  }

  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: { Cookie: `token=${token}` },
    });
  }

  async deleteBooking(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }
}