import { Component, ChangeDetectionStrategy, Inject, Optional } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'module-a-home',
	templateUrl: './home.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
	
	constructor(
		@Optional()
		@Inject('module-b.activator')
		private readonly _moduleBActivator: ReplaySubject<true>
	) { }

	public switch(): void {
		this._moduleBActivator?.next(true);
	}

}