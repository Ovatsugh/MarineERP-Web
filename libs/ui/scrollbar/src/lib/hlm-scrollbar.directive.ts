import { Directive, input } from '@angular/core';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
	selector: 'ng-scrollbar[hlm]',
})
export class HlmScrollbar {
	public readonly userClass = input<string>('', { alias: 'class' });

	constructor() {
		classes(() => ['overflow-hidden rounded-md', this.userClass()]);
	}
}
