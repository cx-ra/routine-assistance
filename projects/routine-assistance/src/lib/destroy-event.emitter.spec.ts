import { TestBed } from '@angular/core/testing';

import { CXraDestroyEventEmitter } from './destroy-event.emitter';

describe('CXraDestroyEventEmitter', () => {
	let service: CXraDestroyEventEmitter;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CXraDestroyEventEmitter);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});