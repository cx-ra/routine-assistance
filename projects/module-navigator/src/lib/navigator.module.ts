import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CXraNavigationItemComponent } from './components/navigation.item/navigation.item.component';

const COMPONENTS = [
	CXraNavigationItemComponent
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