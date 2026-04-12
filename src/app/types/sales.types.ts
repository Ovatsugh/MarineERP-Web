import { PageResponse } from './page.types';

export interface ItemSaleRequest {
  productId: string;
  quantity: number;
}

export interface SalesRequest {
  customerId: string;
  notes?: string;
  items: ItemSaleRequest[];
}

export interface SalesResponse {
  id: string;
  customerId: string;
  amount: number;
  notes?: string;
}

export type SalesPageResponse = PageResponse<SalesResponse>;
