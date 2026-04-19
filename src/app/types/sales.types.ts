import { PageResponse } from './page.types';
import { CustomerResponse } from './customer.types';

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
  customer: CustomerResponse;
  amount: number;
  notes?: string | null;
}

export type SalesPageResponse = PageResponse<SalesResponse>;
