export interface BookingRequest {
  experienceId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatsBooked: number;
  promoCode?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  booking: {
    referenceId: string;
    experience: string;
    date: string;
    time: string;
    seats: number;
    totalAmount: number;
    customerName: string;
  };
}