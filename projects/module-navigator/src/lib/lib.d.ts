/* eslint-disable @typescript-eslint/no-shadow */

import { LoadRemoteEntryScriptOptions, LoadRemoteModuleEsmOptions, LoadRemoteModuleOptions, RemoteConfig } from '@angular-architects/module-federation';
import { WebComponentWrapperOptions } from '@angular-architects/module-federation-tools';
import { ComponentType } from '@angular/cdk/portal';
import { Route } from '@angular/router';
import { Observable } from 'rxjs';

export namespace cxra {

	/**
	 * Alias for naming components.
	 * TODO: remove to `routine`
	 */
	export type ComponentTypeName = string;

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

			/**
			 * Schematic of the navigation element.
			 * @example
			 * 		...
			 */
			interface IScheme<TComponentDefinition> {
				readonly route: IRoute;
				readonly component: TComponentDefinition;
				readonly order?: number;
			}
			
			export type Definition<TEvent> = IScheme<Promise<ComponentType<unknown> | HTML>> & {
				readonly state: Promise<boolean>;
				/** Navigation element events. */
				readonly events: Observable<Array<TEvent>>;
			};

			export interface Options<TEvent> {
				[module: string]: Pick<Definition<TEvent>, 'state'>;
			}

		}

	}

	export namespace module.federation.navigation {

		export type RemoteComponentEsmOptions = Omit<LoadRemoteModuleEsmOptions, 'type'> & { type: ComponentTypeName };

		export namespace item {

			export type Definition = cxra.navigation.item.IScheme<RemoteComponentEsmOptions | HTML>;

		}

		export type RemoteModuleState = 'on' | 'off' | 'promise';
		
		export type NavigableRemoteModuleConfig = 
			RemoteConfig & {
				navigation: string | item.Definition;
			} & 
			Pick<LoadRemoteModuleOptions, 'exposedModule'> &
			Pick<LoadRemoteEntryScriptOptions, 'remoteName'> &
			Pick<WebComponentWrapperOptions, 'elementName'> & {
				state: RemoteModuleState;
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