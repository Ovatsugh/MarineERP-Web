import { ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from "../services/crud.service";
import { ToolsService } from "../services/tools.service";
import { PageResponse } from "../types/page.types";

export interface ListFilters {
	page: number;
	size: number;
	sort?: string;
	searchTerm?: string;
	[key: string]: string | number | boolean | null | undefined;
}

function createEmptyPageResponse<T>(): PageResponse<T> {
	return {
		content: [],
		totalElements: 0,
		totalPages: 0,
		size: 10,
		number: 0,
		numberOfElements: 0,
		first: true,
		last: true,
		empty: true,
	};
}

export abstract class AbstractList<T> {
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly cdr = inject(ChangeDetectorRef);
	private urlSyncEnabled = false;

	protected readonly defaultSize = 10;
	protected get defaultSort(): string {
		return 'name,asc';
	}

	loading = false;
	searchTerm = '';
	protected readonly pageSizes = [10, 25, 50];

	dataSource: PageResponse<T> = createEmptyPageResponse<T>();

	filters: ListFilters = {
		page: 0,
		size: this.defaultSize,
		sort: this.defaultSort,
	};

	constructor(public service: CrudService, public tools: ToolsService) { }

	protected initFromUrl(): void {
		this.urlSyncEnabled = true;
		const params = this.route.snapshot.queryParamMap;

		const page = params.get('page');
		const size = params.get('size');
		const q = params.get('q');
		const sort = params.get('sort');

		if (page !== null) this.filters.page = Math.max(0, Number(page) - 1);
		if (size !== null) this.filters.size = Number(size);
		if (q !== null) { this.searchTerm = q; this.filters.searchTerm = q || undefined; }
		if (sort !== null) this.filters.sort = sort;

		void this.getList();
	}

	async getList() {
		this.filters.page = this.normalizePage(this.filters.page);
		this.filters.size = this.normalizeSize(this.filters.size);
		this.tools.cleanFilters(this.filters);
		this.loading = true;
		this.cdr.markForCheck();

		await this.service
			.listing(this.filters)
			.then((res: PageResponse<T>) => {
				this.dataSource = res;
				if (this.urlSyncEnabled) {
					this.syncToUrl();
				}
			})
			.finally(() => {
				this.loading = false;
				this.cdr.markForCheck();
			});
	}

	private syncToUrl(): void {
		const queryParams: Record<string, string | null> = {
			q: this.filters.searchTerm || null,
			page: String((this.filters.page ?? 0) + 1),
			size: String(this.filters.size ?? this.defaultSize),
			sort: this.filters.sort ?? null,
		};

		void this.router.navigate([], {
			relativeTo: this.route,
			queryParams,
			replaceUrl: true,
		});
	}

	get items(): T[] {
		return this.dataSource.content ?? [];
	}

	get totalElements(): number {
		return this.dataSource.totalElements ?? 0;
	}

	get numberOfElements(): number {
		return this.dataSource.numberOfElements ?? 0;
	}

	get currentPage(): number {
		return this.totalElements ? (this.dataSource.number ?? 0) + 1 : 0;
	}

	get totalPages(): number {
		return this.dataSource.totalPages ?? 0;
	}

	get canGoToPreviousPage(): boolean {
		return !this.dataSource.first;
	}

	get canGoToNextPage(): boolean {
		return !this.dataSource.last;
	}

	async applySearch(): Promise<void> {
		this.filters.searchTerm = this.searchTerm.trim() || undefined;
		this.filters.page = 0;
		await this.getList();
	}

	async onPageSizeChange(size: number): Promise<void> {
		this.filters.size = this.normalizeSize(size);
		this.filters.page = 0;
		await this.getList();
	}

	async goToPage(page: number): Promise<void> {
		const targetPage = this.normalizePage(page);
		const currentFilterPage = this.normalizePage(this.filters.page);

		if (targetPage < 0 || targetPage >= this.totalPages || targetPage === currentFilterPage) {
			return;
		}

		this.filters.page = targetPage;
		await this.getList();
	}

	async goToPreviousPage(): Promise<void> {
		await this.goToPage(this.normalizePage(this.filters.page) - 1);
	}

	async goToNextPage(): Promise<void> {
		await this.goToPage(this.normalizePage(this.filters.page) + 1);
	}

	async onPageChange(event: { page: number; rows: number }): Promise<void> {
		if (event.rows !== this.filters.size) {
			await this.onPageSizeChange(event.rows);
			return;
		}

		await this.goToPage(event.page);
	}

	private normalizePage(page: number | string | null | undefined): number {
		const normalized = Number(page);
		return Number.isFinite(normalized) && normalized >= 0 ? normalized : 0;
	}

	private normalizeSize(size: number | string | null | undefined): number {
		const normalized = Number(size);
		return Number.isFinite(normalized) && normalized > 0 ? normalized : 10;
	}
}
