import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cxra } from './lib';
import { CXraNavigationItemComponent } from './components/navigation.item/navigation.item.component';
import { CXraNavigationBadgeComponent } from './components/navigation.badge/navigation.badge.component';

class ModuleOptionsInjectionToken extends InjectionToken<cxra.navigation.item.Options<unknown>> {
	
	constructor() {
		super('CXra. Remote module navigation options.');
	}
}

const COMPONENTS = [
	CXraNavigationItemComponent,
	CXraNavigationBadgeComponent
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule
	],
	declarations: [
		...COMPONENTS
	],
	exports: [
		...COMPONENTS
	]
})
export class CXraRemoteModuleNavigatorModule { }

export const CXRA_MODULE_OPTIONS = new ModuleOptionsInjectionToken();