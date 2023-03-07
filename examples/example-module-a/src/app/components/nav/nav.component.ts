import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'module-a-nav',
	templateUrl: './nav.component.html',
	standalone: true,
	imports: [
		RouterModule
	],
	providers: [],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleANavComponent {

	constructor() { }

}