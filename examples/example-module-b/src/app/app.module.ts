import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule.forChild([{
			path: '',
			component: HomeComponent,
			pathMatch: 'full'
		}])
	],
	declarations: [
		HomeComponent
	],
	providers: [],
	bootstrap: [
		HomeComponent
	]
})
export class AppModule { }