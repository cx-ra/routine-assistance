/* eslint-disable no-useless-computed-key */

import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cxra, CXraModuleNavigatorManifest, CXraRemoteModuleNavigatorModule, CXRA_MODULE_NAVIGATOR_OPTIONS, CXRA_MODULE_OPTIONS } from '@cxra/module-federation-navigator';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { UnfoundComponent } from './components/unfound/unfound.component';
import { BehaviorSubject, interval, Observable, of, ReplaySubject } from 'rxjs';
import { ExampleContextModule } from 'examples/example-context/src/public-api';
import { first, scan, switchMap, takeWhile } from 'rxjs/operators';

@NgModule({
	imports: [
		BrowserModule,
		CXraRemoteModuleNavigatorModule,
		ExampleContextModule,
		RouterModule.forRoot([{
			path: '',
			component: WelcomeComponent,
			pathMatch: 'full'
		}])
	],
	declarations: [
		HomeComponent,
		UnfoundComponent,
		WelcomeComponent
	],
	providers: [{
		provide: CXRA_MODULE_NAVIGATOR_OPTIONS,
		useValue: {
			undefined: {
				component: UnfoundComponent
			}
		}
	}, {
		provide: 'module-a.countdown',
		useValue: of({ default: 10, iterator: 1 }).pipe(
			switchMap(_settings => interval(1000).pipe(
				scan((acc) => acc - _settings.iterator, _settings.default)
			)),
			takeWhile(val => val >= 0)
		)
	}, {
		provide: 'module-b.activator',
		useValue: new ReplaySubject<true>()
	}, {
		provide: CXRA_MODULE_OPTIONS,
		useFactory: (countdown$: Observable<number>, activator$: ReplaySubject<true>) => ({
			['module-a']: {
				state: new Promise<boolean>((resolve) => {
					countdown$.pipe(
						first(value => value === 0)
					).subscribe(() => resolve(true));
				}),
				events: new BehaviorSubject<unknown>([
					{ message: 'test #1' },
					{ message: 'test #2' }
				])
			},
			['module-b']: {
				state: new Promise<boolean>((resolve) => {
					activator$.subscribe(() => resolve(true));
				})
			}
		}),
		deps: ['module-a.countdown', 'module-b.activator'],
		multi: true
	}, {
		// Preload: routes and other internal configurations
		provide: APP_INITIALIZER,
		useFactory: (manifest: CXraModuleNavigatorManifest<cxra.module.federation.navigation.NavigableRemoteModuleConfig>) => 
			(): Promise<void> => 
				manifest.load('/assets/modules.manifest.json'),
		deps: [CXraModuleNavigatorManifest],
		multi: true
	}],
	bootstrap: [HomeComponent]
})
export class AppModule { }