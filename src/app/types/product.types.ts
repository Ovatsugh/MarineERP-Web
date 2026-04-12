import { PageResponse } from './page.types';

export interface ProductRequest {
	name: string;
	price: number | null;
	stock_quantity: number | null;
	bikeModel: string;
	description?: string;
	code?: string;
}

export interface ProductResponse {
	id: string;
	name: string;
	price: number;
	stock_quantity: number;
	bikeModel: string;
	code?: string;
	description?: string;
}

export type ProductPageResponse = PageResponse<ProductResponse>;
