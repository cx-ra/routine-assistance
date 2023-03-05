import { loadRemoteModule, LoadRemoteModuleEsmOptions } from '@angular-architects/module-federation';
import { WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { Route } from '@angular/router';
import { cxra } from './lib.d';

function toRoute<TModuleConfig extends cxra.module.federation.navigation.NavigableRemoteModuleConfig>(
	_definition: TModuleConfig
): Route {
	const _path = typeof _definition.navigation === 'object'
		? _definition.navigation.route.path
		: _definition.navigation;
	switch (_definition.type) {
		case 'module': {
			return {
				path: _path,
				loadChildren: () => 
					loadRemoteModule({
						type: 'manifest',
						remoteName: _definition.remoteName,
						exposedModule: _definition.exposedModule
					}).then(m => m[_definition.elementName])
			};
		}
		default: {
			return {
				path: _path,
				component: WebComponentWrapper,
				data: {
					type: 'script',
					remoteEntry: _definition.remoteEntry,
					remoteName: _definition.remoteName,
					exposedModule: './web-components',
					elementName: _definition.elementName
				} as WebComponentWrapperOptions
			};
		}
	}
}

function toComponentDefinition(
	_definition: cxra.module.federation.navigation.RemoteComponentEsmOptions | cxra.HTML
): Promise<ComponentType<unknown> | cxra.HTML> {
	switch (typeof _definition) {
		case 'string': {
			return new Promise<cxra.HTML>(resolve => {
				resolve(_definition);
			});
		}
		default: {
			return loadRemoteModule(
				Object.assign<LoadRemoteModuleEsmOptions, Omit<LoadRemoteModuleEsmOptions, 'type'>, Partial<LoadRemoteModuleEsmOptions>>(
					{} as LoadRemoteModuleEsmOptions,
					_definition,
					{ type: 'module' }
				)
			// TODO: Обработка ошибки загрузки модуля
			).then(m => {
				const _type = m[_definition.type];
				if (typeof _type !== 'function' || _type.ɵcmp.standalone !== true) {
					throw new TypeError(
						`Assigned class '${_definition.type}' is not a component of the '${_definition.remoteEntry}' entry.`
					);
				}
				return _type as ComponentType<unknown>;
			});
		}
	}
}

function toNavigationDefinition<TEvent>(
	_definition: cxra.module.federation.navigation.item.Definition,
	_injector: Injector
): cxra.navigation.item.Definition<TEvent> {
	let _options: Partial<cxra.navigation.item.Options<TEvent>>;
	try {
		_options = _definition.options
			? _injector.get(_definition.options, undefined)
			: undefined;
	} catch {
		_options = undefined;
	}
	return {
		route: _definition.route,
		component: toComponentDefinition(_definition.component),
		options: _options
	};
}

/** Method for build remote modules definition. */
export function buildModuleNavigatorDefinition<TModuleConfig extends cxra.module.federation.navigation.NavigableRemoteModuleConfig>(
	cfg: cxra.module.federation.navigation.navigator.Manifest<TModuleConfig>,
	_injector: Injector
): cxra.module.federation.navigation.navigator.Definition {
	const modules = Object
		.keys(cfg)
		.map<cxra.module.federation.navigation.NavigableRemoteModuleConfig>(_section => cfg[_section])
		.filter(_definition => _definition.on);
	return ({
		routes: modules.map<Route>(_definition => toRoute(_definition)),
		navigation: modules
			.map(_definition => _definition.navigation)
			.filter(_route => typeof _route === 'object')
			.map((_definition: cxra.module.federation.navigation.item.Definition) => toNavigationDefinition<unknown>(_definition, _injector))
			.sort((a, b) => a.options?.order - b.options?.order)
	});
}