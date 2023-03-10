import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { CXraDestroyEventEmitter } from '@cxra/routine-assistance';
import { combineLatest, from } from 'rxjs';
import { map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { cxra } from './lib.d';
import { CXraModuleNavigatorManifest } from './navigator.manifest';

export const CXRA_MODULE_NAVIGATOR_OPTIONS = new InjectionToken<Partial<cxra.module.federation.navigation.navigator.Options>>(
	'CXRA Module navigator behavior options'
);

@Injectable({ providedIn: 'root' })
export class CXraModuleNavigator extends CXraDestroyEventEmitter {

	private readonly _default: Routes;

	public readonly navigation$ = this._manifest.definition$.pipe(
		map(_definition => _definition.navigation),
		switchMap(_items => combineLatest(
			_items.map(_item => from(_item.state).pipe(
				startWith(false),
				map(_state => _state
					? _item
					: 'inactive'
				),
				takeUntil(this)
			))
		)),
		map(_items => _items
			.filter(_item => _item !== 'inactive')
			.map(_item => _item as cxra.navigation.item.Definition<unknown>)
		),
		shareReplay({ bufferSize: 1, refCount: false }),
		takeUntil(this)
	);

	constructor(
		private readonly _manifest: CXraModuleNavigatorManifest<cxra.module.federation.navigation.NavigableRemoteModuleConfig>,
		_router: Router,
		@Inject(CXRA_MODULE_NAVIGATOR_OPTIONS)
		@Optional()
		_options?: Partial<cxra.module.federation.navigation.navigator.Options>
	) {
		super();
		this._default = _router.config;
		this._manifest.definition$.pipe(
			takeUntil(this)
		).subscribe(definition => {
			_router.resetConfig([
				...this._default,
				...definition.routes,
				..._options?.undefined
					? [{
						path: '**',
						component: _options.undefined.component
					}]
					:[]
			]);
		});
	}

}