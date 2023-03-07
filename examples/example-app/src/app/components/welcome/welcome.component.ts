import { Inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContextService } from 'examples/example-context/src/public-api';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent {

	constructor(
		@Inject('ModuleBNavComponentOptions')
		private readonly _moduleBNavComponentOptions: { 
			active$: BehaviorSubject<boolean>;
		},
		public readonly context: ContextService
	) { }

	public switch(): void {
		this._moduleBNavComponentOptions.active$.next(!this._moduleBNavComponentOptions.active$.value);
	}

}
