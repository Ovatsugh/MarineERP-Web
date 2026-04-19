import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardTableSection } from './components/table-section';

@Component({
	selector: 'app-dashboard',
	imports: [DashboardTableSection],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="@container/main flex h-[calc(100svh-3rem)] min-h-0 flex-1 flex-col gap-2 overflow-hidden">
			<div class="flex min-h-0 flex-1 flex-col gap-4 p-6 md:gap-6">
				<!-- <app-dashboard-card-section class="shrink-0" /> -->
				<app-dashboard-table-section />
			</div>
		</div>
	`,
})
export class Dashboard {}
