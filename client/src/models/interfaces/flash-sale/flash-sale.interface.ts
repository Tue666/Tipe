import { FlashSaleSchema } from '../schema';

export interface FlashSale extends FlashSaleSchema {}

export interface FlashSaleSession extends Pick<FlashSale, '_id' | 'start_time' | 'banners'> {
  on_going: boolean;
}

export interface FindForSessionsResponse {
  sessions: FlashSaleSession[];
}
