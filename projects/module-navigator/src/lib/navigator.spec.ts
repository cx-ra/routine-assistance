import { TestBed } from '@angular/core/testing';

import { CXraModuleNavigator } from './navigator';

describe('ModuleNavigator', () => {
	let service: CXraModuleNavigator;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CXraModuleNavigator);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});

// TODO: Ожидание одного модуля из двух, если один выключен
// TODO: Ожидание двух из двух модулей, если один с типом модуль, а другой с типом скрипт