import { MessageResponse } from '../common';
import { FlashSaleSchema } from '../schema';

export interface FlashSale extends FlashSaleSchema {}

export interface FlashSaleSession extends Omit<FlashSale, 'status'> {
  on_going: boolean;
}

export interface NextFlashSaleResponse extends MessageResponse {
  flashSale: FlashSaleSession;
}

export interface FindForSessionsResponse {
  sessions: FlashSaleSession[];
}
