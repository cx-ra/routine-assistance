import { loadRemoteModule, LoadRemoteModuleEsmOptions } from '@angular-architects/module-federation';
import { WebComponentWrapper, WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { ComponentType } from '@angular/cdk/portal';
import { KeyValue } from '@angular/common';
import { Injector } from '@angular/core';
import { Route } from '@angular/router';
import { CXRA_MODULE_OPTIONS } from './navigator.module';
import { Subject } from 'rxjs';
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
	_state: Promise<boolean>,
	_definition: cxra.module.federation.navigation.item.Definition
): cxra.navigation.item.Definition<TEvent> {
	return {
		state: _state,
		route: _definition.route,
		component: toComponentDefinition(_definition.component),
		events: new Subject<Array<TEvent>>()
	};
}

/** Method for build remote modules definition. */
export function buildModuleNavigatorDefinition<TModuleConfig extends cxra.module.federation.navigation.NavigableRemoteModuleConfig>(
	cfg: cxra.module.federation.navigation.navigator.Manifest<TModuleConfig>,
	_injector: Injector
): cxra.module.federation.navigation.navigator.Definition {
	const modules = Object
		.keys(cfg)
		.map<KeyValue<string, cxra.module.federation.navigation.NavigableRemoteModuleConfig>>(_section => ({ key: _section, value: cfg[_section] }));
	const options = _injector
		.get<Array<cxra.navigation.item.OptionsNew<unknown>>>(CXRA_MODULE_OPTIONS)
		.reduce((accumulator, i) => Object.assign(accumulator, i), {});
	return ({
		routes: modules
			.filter(_definition => _definition.value.state !== 'off')
			.map<Route>(_definition => toRoute(_definition.value)),
		navigation: modules
			// Обрабатываем модули для которых задано описание навигации, а не только маршрут перехода
			.filter(_definition => typeof _definition.value.navigation === 'object')
			.map(_definition => toNavigationDefinition<unknown>(
				_definition.value.state === 'promise' && Object.isD(options[_definition.key]?.state)
					? options[_definition.key].state
					: new Promise<boolean>((resolve) => {
						resolve(
							_definition.value.state === 'on'
								? true
								: false
						);
					}),
				_definition.value.navigation as cxra.module.federation.navigation.item.Definition
			))
			.sort((a, b) => a.order - b.order)
	});
}