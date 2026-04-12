import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from './app-sidebar';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, AppSidebar, HlmSidebarImports],
	template: `
		<app-sidebar>
			<main hlmSidebarInset>
				<header class="bg-background/90 sticky top-0 z-10 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
					<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
						<button hlmSidebarTrigger><span class="sr-only">Toggle sidebar</span></button>
						<h1 class="text-base font-medium">Documents</h1>
					</div>
				</header>
				<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
					<router-outlet />
				</div>
			</main>
		</app-sidebar>
	`,
})
export class App {}
