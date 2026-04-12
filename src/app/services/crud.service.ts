import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviironment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudService {

  path = '';
  baseUrl = environment.url;

  constructor(private http: HttpClient) { 

  }

  getBaseUrl() {
    return this.joinUrl(this.baseUrl, this.path);
  }

  private joinUrl(...parts: string[]) {
    return parts
      .filter((part) => part != null && part !== '')
      .map((part, index) =>
        index === 0 ? part.replace(/\/+$/, '') : part.replace(/^\/+|\/+$/g, '')
      )
      .join('/');
  }

  listing(queryParams: any = {}): Promise<any> {
		return lastValueFrom(this.http.get(`${this.getBaseUrl()}`, { params: queryParams }));
	}
	create(data: any): Promise<any> {
		return lastValueFrom(this.http.post(`${this.getBaseUrl()}`, data));
	}
	show(id: any, params: any = {}): Promise<any> {
		return lastValueFrom(this.http.get(`${this.getBaseUrl()}/${id}`, { params }));
	}
	update(data: any, id: any): Promise<any> {
		return lastValueFrom(this.http.put(`${this.getBaseUrl()}/${id}`, data));
	}
	delete(id: any): Promise<any> {
		return lastValueFrom(this.http.delete(`${this.getBaseUrl()}/${id}`));
	}

	getCustom(path: string, data: any = {}): Promise<any> {
		return lastValueFrom(this.http.get(this.joinUrl(this.baseUrl, path), { params: data }));
	}
	postCustom(path: string, data: any = {}): Promise<any> {
		return lastValueFrom(this.http.post(this.joinUrl(this.baseUrl, path), data));
	}
	updateCustom(path: string, data: any = {}): Promise<any> {
		return lastValueFrom(this.http.put(this.joinUrl(this.baseUrl, path), data));
	}
	deleteCustom(path: string, data: any = {}): Promise<any> {
		return lastValueFrom(this.http.delete(this.joinUrl(this.baseUrl, path), data));
	}
  
}
