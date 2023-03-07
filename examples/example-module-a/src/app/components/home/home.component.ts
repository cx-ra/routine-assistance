import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'module-a-home',
	templateUrl: './home.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	
	constructor(
		@Inject('ModuleANavComponentOptions')
		private readonly _moduleBNavComponentOptions: { 
			active$: BehaviorSubject<boolean>;
		}
	) { }

	public switch(): void {
		this._moduleBNavComponentOptions.active$.next(!this._moduleBNavComponentOptions.active$.value);
	}

}