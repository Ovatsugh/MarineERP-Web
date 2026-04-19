import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToaster } from '@spartan-ng/helm/sonner';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, HlmToaster],
	template: `
		<hlm-toaster richColors theme="system" position="top-right" />
		<router-outlet />
	`,
})
export class App {}
