import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerSearch } from '@ng-icons/tabler-icons';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { CrudService } from '../../../services/crud.service';
import { ToolsService } from '../../../services/tools.service';
import { AbstractList } from '../../../shared/abstract-list';
import { SalesResponse } from '../../../types/sales.types';

@Component({
	selector: 'app-dashboard-table-section',
	imports: [HlmButtonImports, HlmTableImports, HlmSelectImports, HlmInputImports, HlmSpinner, FormsModule, NgIcon, HlmIcon, HlmLabel],
	providers: [provideIcons({ tablerSearch }), CrudService],
	host: { class: 'block min-h-0 flex-1 px-6' },
	templateUrl: './table-section.html',
})
export class DashboardTableSection extends AbstractList<SalesResponse> implements OnInit {

	protected override get defaultSort(): string {
		return 'id,asc';
	}

	constructor(service: CrudService, tools: ToolsService) {
		super(service, tools);
		this.service.path = 'sales';
	}

	ngOnInit(): void {
		void this.getList();
	}

	formatCurrency(value: number): string {
		return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
	}

	formatPhone(phone?: string): string {
		if (!phone) return '-';
		if (phone.length === 11) return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
		if (phone.length === 10) return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
		return phone;
	}
}
