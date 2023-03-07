import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { cxra, CXraModuleNavigatorManifest, CXraRemoteModuleNavigatorModule, CXRA_MODULE_NAVIGATOR_OPTIONS } from '@cxra/module-federation-navigator';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { UnfoundComponent } from './components/unfound/unfound.component';
import { BehaviorSubject } from 'rxjs';
import { ExampleContextModule } from 'examples/example-context/src/public-api';

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
		provide: 'ModuleBNavComponentOptions',
		useValue: { 
			active$: new BehaviorSubject<boolean>(true),
			order: 3
		}
	}, {
		provide: 'ModuleANavComponentOptions', // ModuleANavComponent
		useValue: { 
			active$: new BehaviorSubject<boolean>(true),
			order: 2
		}
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