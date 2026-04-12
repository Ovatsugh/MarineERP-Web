import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {

  	cleanFilters(filters: any) {
		const keys = Object.keys(filters);
		for (let key of keys) {
			if (filters[key] == null || filters[key] == '') {
				delete filters[key];
			}
		}
		return filters;
	}
  
}
