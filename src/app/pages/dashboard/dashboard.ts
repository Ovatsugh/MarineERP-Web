import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardCardSection } from './components/card-section';
import { DashboardTableSection } from './components/table-section';

@Component({
	selector: 'app-dashboard',
	imports: [DashboardCardSection, DashboardTableSection],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="@container/main flex flex-1 flex-col gap-2">
			<div class="flex flex-col gap-4 p-6 md:gap-6">
				<app-dashboard-card-section />
				<app-dashboard-table-section />
			</div>
		</div>
	`,
})
export class Dashboard {}
