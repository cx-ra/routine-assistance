import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CXraModuleNavigator } from '@cxra/module-federation-navigator';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

	constructor(
		public readonly navigator: CXraModuleNavigator,
	) { }

}