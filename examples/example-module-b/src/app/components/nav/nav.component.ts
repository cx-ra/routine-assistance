import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'module-b-nav',
	templateUrl: './nav.component.html',
	standalone: true,
	imports: [
		RouterModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleBNavComponent {

	constructor() { }

}