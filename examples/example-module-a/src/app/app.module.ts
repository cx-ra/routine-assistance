import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TestComponent } from 'examples/example-module-a/src/app/components/test/test.component';
import { HomeComponent } from 'examples/example-module-a/src/app/components/home/home.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule.forChild([{
			path: '',
			component: HomeComponent,
			pathMatch: 'full',
			children: [{
				path: 'test',
				component: TestComponent
			}]
		}])
	],
	declarations: [
		HomeComponent,
		TestComponent
	],
	providers: [],
	bootstrap: [
		HomeComponent
	]
})
export class AppModule { }