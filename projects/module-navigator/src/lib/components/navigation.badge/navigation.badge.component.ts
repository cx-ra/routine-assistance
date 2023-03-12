import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CXraDestroyEventEmitter } from '@cxra/routine-assistance';

/** The <cxra-nb> element represents a navigation badge. */
@Component({
	selector: 'cxra-nb',
	templateUrl: './navigation.badge.component.html',
	styleUrls: ['./navigation.badge.component.scss'],
	providers: [CXraDestroyEventEmitter],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CXraNavigationBadgeComponent {

	constructor() { }

}