/* eslint-disable @typescript-eslint/no-shadow */

import { LoadRemoteEntryScriptOptions, LoadRemoteModuleEsmOptions, LoadRemoteModuleOptions, RemoteConfig } from '@angular-architects/module-federation';
import { WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { ComponentType } from '@angular/cdk/portal';
import { KeyValue } from '@angular/common';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';

export namespace cxra {

	/**
	 * Alias for naming components.
	 * TODO: remove to `routine`
	 */
	export type ComponentTypeName = string;

	export type StringToken = string;

	/**
	 * Alias for html template.
	 * TODO: remove to `routine`
	 */
	export type HTML = string;

	export namespace navigation {

		export interface IRoute {
			readonly path: string;
			readonly params?: { [key: string]: string };
			readonly queries?: { [key: string]: string };
		}

		export namespace item {

			export interface Options<TEvent> {
				/** Navigation element events. */
				readonly events$: Observable<Array<TEvent>>;
				readonly title: string;
				readonly order: number;
				/** Flag that the element can disappear depending on some events. */
				active$: Observable<boolean>;
			}

			/**
			 * Schematic of the navigation element.
			 * @example
			 * 		...
			 */
			interface IScheme<TComponentDefinition, TEvent, TOptionsDefinition extends (Partial<Options<TEvent>> | StringToken)> {
				readonly route: IRoute;
				readonly component: TComponentDefinition;
				readonly options?: TOptionsDefinition;
			}
			
			export type Definition<TEvent> = IScheme<Promise<ComponentType<unknown> | HTML>, TEvent, Partial<Options<TEvent>>>;

		}

	}

	export namespace module.federation.navigation {

		export type RemoteComponentEsmOptions = Omit<LoadRemoteModuleEsmOptions, 'type'> & { type: ComponentTypeName };

		export namespace item {

			export type Definition = cxra.navigation.item.IScheme<RemoteComponentEsmOptions | HTML, unknown, StringToken>;

			/** Description of rule the navigation element for publishing in DI. */
			export type ComponentOptions = KeyValue<ComponentType<unknown>, cxra.navigation.item.Options<unknown>>;

		}
		
		export type NavigableRemoteModuleConfig = 
			RemoteConfig & {
				navigation: string | item.Definition;
			} & 
			Pick<LoadRemoteModuleOptions, 'exposedModule'> &
			Pick<LoadRemoteEntryScriptOptions, 'remoteName'> &
			Pick<WebComponentWrapperOptions, 'elementName'> & {
				on: boolean;
			};

		export namespace navigator {

			/** Remote modules navigator behavior options. */
			export interface Options {
				/** Behavior when an undefined route is called. */
				undefined: Pick<Route, 'component'>;
			}

			export interface Definition {
				readonly routes: Array<Route>;
				readonly navigation: Array<cxra.navigation.item.Definition<unknown>>;
			}

			export interface Manifest<TModuleConfig extends NavigableRemoteModuleConfig> {
				[module: string]: TModuleConfig;
			}

			/** Alias for remote module navigator manifest without contract extension. */
			export type SimplicityManifest = Manifest<NavigableRemoteModuleConfig>;
			
		}

	}

}