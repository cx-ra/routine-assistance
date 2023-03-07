import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'module-a-test',
	templateUrl: './test.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestComponent {
	constructor() { }
}
