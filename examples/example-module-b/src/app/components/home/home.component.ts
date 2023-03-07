import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ContextService } from 'examples/example-context/src/public-api';

@Component({
	selector: 'module-b-home',
	templateUrl: './home.component.html',
	styleUrls:['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	
	constructor(
		public readonly context: ContextService
	) { }

}
