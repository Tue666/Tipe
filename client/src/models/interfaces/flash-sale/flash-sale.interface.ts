import { FlashSaleSchema } from '../schema';

export interface FlashSale extends FlashSaleSchema {}

export interface FindResponse {
  sessions: Pick<FlashSale, '_id' | 'start_time' | 'banners'>[];
}
