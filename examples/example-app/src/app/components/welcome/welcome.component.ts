import { Inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextService } from 'examples/example-context/src/public-api';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {

	constructor(
		@Inject('module-a.countdown')
		public readonly countdown$: Observable<number>,
		public readonly context: ContextService
	) { }

}
