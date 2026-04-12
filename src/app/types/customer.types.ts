import { PageResponse } from './page.types';

export interface CustomerRequest {
  name: string;
  cpf: string;
  phone: string;
}

export interface CustomerResponse {
  id: string;
  name: string;
  cpf: string;
  phone: string;
}

export type CustomerPageResponse = PageResponse<CustomerResponse>;
