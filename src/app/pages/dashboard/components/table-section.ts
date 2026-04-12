import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerChevronLeft, tablerChevronRight, tablerChevronsLeft, tablerChevronsRight } from '@ng-icons/tabler-icons';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
	ColumnDef,
	ColumnFiltersState,
	createAngularTable,
	FlexRender,
	flexRenderComponent,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	VisibilityState,
} from '@tanstack/angular-table';
import { ActionDropdown } from './action-dropdown';
import { DASHBOARD_DATA, DashboardData } from './dashboard-data.model';
import { HeaderCell } from './header-cell';
import { LimitCell } from './limit-cell';
import { ReviewerCell } from './reviewer-cell';
import { StatusCell } from './status-cell';
import { TargetCell } from './target-cell';
import { TypeCell } from './type-cell';

@Component({
	selector: 'app-dashboard-table-section',
	imports: [
		HlmTableImports,
		HlmSelectImports,
		HlmButton,
		FormsModule,
		FlexRender,
		NgIcon,
		HlmIcon,
		HlmLabel,
	],
	providers: [
		provideIcons({ tablerChevronLeft, tablerChevronsLeft, tablerChevronRight, tablerChevronsRight }),
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { class: 'px-6' },
	template: `
		<div class="max-h-[700px] w-full overflow-auto rounded-md border">
			<div hlmTableContainer>
				<table hlmTable>
					<thead hlmTHead class="bg-muted sticky top-0 z-10">
						@for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
							<tr hlmTr>
								@for (header of headerGroup.headers; track header.id) {
									<th hlmTh [attr.colSpan]="header.colSpan">
										@if (!header.isPlaceholder) {
											<ng-container *flexRender="header.column.columnDef.header; props: header.getContext(); let headerText">
												<div [innerHTML]="headerText"></div>
											</ng-container>
										}
									</th>
								}
							</tr>
						}
					</thead>
					<tbody hlmTBody>
						@for (row of table.getRowModel().rows; track row.id) {
							<tr hlmTr [attr.data-state]="row.getIsSelected() && 'selected'">
								@for (cell of row.getVisibleCells(); track $index) {
									<td hlmTd>
										<ng-container *flexRender="cell.column.columnDef.cell; props: cell.getContext(); let cell">
											<div [innerHTML]="cell"></div>
										</ng-container>
									</td>
								}
							</tr>
						} @empty {
							<tr hlmTr>
								<td hlmTd class="h-24 text-center" [attr.colspan]="_columns.length">No results.</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>
		<div class="mt-4 flex flex-col justify-between sm:flex-row sm:items-center">
			<span class="text-muted-foreground text-sm">
				{{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} row(s) selected
			</span>
			<div class="mt-2 flex gap-8 sm:mt-0">
				<div class="flex gap-2">
					<span hlmLabel>Row per page:</span>
					<hlm-select class="inline-block" [ngModel]="table.getState().pagination.pageSize" (ngModelChange)="table.setPageSize($event); table.resetPageIndex()">
						<hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
							<hlm-select-value placeholder="{{ _availablePageSizes[0] }}" />
						</hlm-select-trigger>
						<hlm-select-content *hlmSelectPortal>
							<hlm-select-group>
								@for (size of _availablePageSizes; track size) {
									<hlm-select-item [value]="size">{{ size }}</hlm-select-item>
								}
							</hlm-select-group>
						</hlm-select-content>
					</hlm-select>
				</div>
				<span hlmLabel>Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}</span>
				<div class="flex space-x-1">
					<button size="icon-sm" variant="outline" hlmBtn [disabled]="!table.getCanPreviousPage()" (click)="table.firstPage()">
						<ng-icon hlm name="tablerChevronsLeft" size="sm" />
					</button>
					<button size="icon-sm" variant="outline" hlmBtn [disabled]="!table.getCanPreviousPage()" (click)="table.previousPage()">
						<ng-icon hlm name="tablerChevronLeft" size="sm" />
					</button>
					<button size="icon-sm" variant="outline" hlmBtn [disabled]="!table.getCanNextPage()" (click)="table.nextPage()">
						<ng-icon hlm name="tablerChevronRight" size="sm" />
					</button>
					<button size="icon-sm" variant="outline" hlmBtn [disabled]="!table.getCanNextPage()" (click)="table.lastPage()">
						<ng-icon hlm name="tablerChevronsRight" size="sm" />
					</button>
				</div>
			</div>
		</div>
	`,
})
export class DashboardTableSection {
	protected readonly _availablePageSizes = [5, 10, 20];
	private readonly _visibility = signal<VisibilityState>({});
	private readonly _columnFilters = signal<ColumnFiltersState>([]);
	private readonly _sorting = signal<SortingState>([]);
	private readonly _pagination = signal<PaginationState>({ pageSize: 10, pageIndex: 0 });

	protected readonly _columns: ColumnDef<DashboardData>[] = [
		{
			accessorKey: 'header',
			id: 'header',
			header: () => 'Header',
			cell: () => flexRenderComponent(HeaderCell),
			enableSorting: false,
		},
		{
			accessorKey: 'type',
			id: 'type',
			header: () => 'Type',
			cell: () => flexRenderComponent(TypeCell),
			enableSorting: false,
		},
		{
			accessorKey: 'status',
			id: 'status',
			header: () => 'Status',
			cell: () => flexRenderComponent(StatusCell),
			enableSorting: false,
		},
		{
			accessorKey: 'target',
			id: 'target',
			header: () => 'Target',
			cell: () => flexRenderComponent(TargetCell),
		},
		{
			accessorKey: 'limit',
			id: 'limit',
			header: () => 'Limit',
			cell: () => flexRenderComponent(LimitCell),
		},
		{
			accessorKey: 'reviewer',
			id: 'reviewer',
			header: () => 'Reviewer',
			cell: () => flexRenderComponent(ReviewerCell),
			enableSorting: false,
		},
		{
			id: 'action',
			enableHiding: false,
			cell: () => flexRenderComponent(ActionDropdown),
		},
	];

	public readonly table = createAngularTable<DashboardData>(() => ({
		data: DASHBOARD_DATA,
		columns: this._columns,
		state: {
			columnFilters: this._columnFilters(),
			sorting: this._sorting(),
			pagination: this._pagination(),
			columnVisibility: this._visibility(),
		},
		onColumnVisibilityChange: (updater) => {
			updater instanceof Function ? this._visibility.update(updater) : this._visibility.set(updater);
		},
		onColumnFiltersChange: (updater) => {
			updater instanceof Function ? this._columnFilters.update(updater) : this._columnFilters.set(updater);
		},
		onSortingChange: (updater) => {
			updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
		},
		onPaginationChange: (updater) => {
			updater instanceof Function ? this._pagination.update(updater) : this._pagination.set(updater);
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	}));
}
