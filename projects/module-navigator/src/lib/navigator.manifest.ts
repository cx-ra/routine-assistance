import { setManifest } from '@angular-architects/module-federation';
import { Injectable, Injector } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { cxra } from './lib';
import { buildModuleNavigatorDefinition } from './navigator.definition.builder'; 

/** Remote modules navigator configuration. */
@Injectable({ providedIn: 'root' })
export class CXraModuleNavigatorManifest<TModuleConfig extends cxra.module.federation.navigation.NavigableRemoteModuleConfig> {

	private readonly _definition$ = new ReplaySubject<cxra.module.federation.navigation.navigator.Definition>();

	public readonly definition$: Observable<cxra.module.federation.navigation.navigator.Definition> = this._definition$;

	constructor(
		private readonly _injector: Injector
	) { }

	/** Method for loading remote modules navigator configuration from a file. */
	public load(file: string): Promise<void> {
		return fetch(file).then((result) => {
			if (result.status === 404) {
				throw new Error(`Unable to access module navigator configuration file: ${result.url}`);
			}
			return result.json() as Promise<cxra.module.federation.navigation.navigator.Manifest<TModuleConfig>>;
		}).then(_cfg => {
			if (Object.keys(_cfg).length < 1) {
				throw new Error('Module navigator configuration file does not contain meaningful modules');
			}
			if (Object.values(_cfg).every(o => !o.on)) {
				throw new Error('Module navigator configuration file does not contain turned on modules');
			}
			return _cfg;
		}).then(_cfg => {
			this._definition$.next(buildModuleNavigatorDefinition(_cfg, this._injector));
			return _cfg;
		}).then(_cfg => Object.keys(_cfg).reduce((accumulator, i) => {
			// Formation of the module federation manifest, only for modules described as being loaded as `module`
			if (_cfg[i].type === 'module') {
				accumulator[i] = _cfg[i];
			}
			return accumulator;
		}, {})).then(_manifest => {
			// Formation of the module federation manifest, based on the config
			setManifest(_manifest);
		}).catch((error: Error) => {
			throw new Error(`Could not be read module navigator configuration file: ${file} with error: ${error}`);
		});
	}

}