# @cxra/routine-assistance

## Pipes
	
`isD` checks if the value is defined
	
`isND` checks if the value is undefined or null
	
`asSanitizedHtml` is meant to be sanitized to declarative html for use in a template

# @cxra/module-federation-navigator

Данная библиотека, предназначена:
* To make it a little easier to work with [Module Federation](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md) in basic cases.
* Автоматизировать не только управление модулями через файл конфигурации, но и управление навигацией к этим модулям и доступностью их для разных контекстов исполнения. _Данная потребность возникала:_
	* В продуктовой разработке когда один продукт разворачивается для разных заказчиков с разной конфигурациеи.
	* Когда нужно предоставить возможность devops быстро отключать, включать и конфигурировать состав. 
* Сохранить возможность ленивой загрузки и при этом дать возможность самим модулям предоставлять компонент который будет использован в качестве навигационного элемента

## Конфигурирование

Основные настройки описываются в конфигурационном файле манифеста модулей `{manifest_name}.json` для изменения конфигурации после развертывания.
	
* Рекомендуемым местом расположения файла конфигурации для проектов где основное приложение написано на angular является `.\{app-name}\src\assets\{manifest_name}.json` для публикации стандартными средствами
* Так же регулярным вариантом использования является сборка и предоставления манифеста server-side в виде ответа на запрос, так как формат данных манифеста `json`

Recommended point to load the configuration is to implement the standard angular app init loop, by provide `APP_INITIALIZER`

```
	providers: [{
		provide: APP_INITIALIZER,
		useFactory: (manifest: CXraModuleNavigatorManifest<cxra.module.federation.navigation.NavigableRemoteModuleConfig>) => 
			(): Promise<void> => 
				manifest.load('/assets/modules.manifest.json'),
		deps: [CXraModuleNavigatorManifest],
		multi: true
	}],
```

### Настройка источников модулей

Данная библиотека основана на [angular-architects/module-federation-plugin](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md), по этому основными видами потребляемых модулей являются:

* Модули `angular`. В качестве `type` указывается значение _module_.

	```
		"module-a": {
			"type": "module"
			"remoteEntry": "http://localhost:3000/remoteEntry.js"
			"remoteName": "example-module-a"
			"exposedModule": "./Module"
			"elementName": "AppModule"
			...
		}
	```

	`elementName` наименование основного класса публикуемого как angular module.
	
	В частности пример приведенный выше, справедлив для внешнего модуль публикованного следующим образом 
	```
		name: "example-module-a"
		exposes: {
			"./Module": "./examples/example-module-a/src/app/app.module.ts"
			"./Component": "./examples/example-module-a/src/app/components/nav/nav.component.ts"
		}
	```

* Скрипты `js`. В качестве `type` указывается значение _script_.

	```
		"react-a": {
			"type": "script"
			"remoteEntry": "https://witty-wave-0a695f710.azurestaticapps.net/remoteEntry.js"
			"remoteName": "react"
			"exposedModule": "./web-components"
			"elementName": "react-element"
		}
	```

	`elementName` наименование component получаемого из публикации в качестве root.

---

Общие настройки вне зависимости от типа:
		
`remoteEntry` публичный адрес размещения сгенерированного файла декларации интегрируемых модулей.

`remoteName` наименование remote object используемое для публикации.
	
`exposedModule` наименование секции размещения модуля в экспозиции.

### Настройка навигации модуля

На базовом уровне навигация определяется свойством `navigation`.

* Для модуля может быть определено поведение без навигационного элемента. 	

	Данное решение может быть применимо в случаях когда функциональность remote модуля должна быть доступна только из определенного блока интерфейса или как звено определенного бизнес сценария. Такой подход реализуется по средствам доступа по конкретному маршруту.
	
	`navigation` задается непосредственно строкой описывающей route.

	```
		"navigation": "module-a/offers/:id/accepted"
	```

* Для модуля может быть определена глобальная навигация.

	Данное решение предоставляет возможность самому модулю запубликовать навигационный элемент, `component` который будет использован для отображения в меню, инвертировав данную зависимость из основного приложения. Или напрямую в конфигурационном файле определить `template` который будет использоваться в качестве навигационного элемента, что позволяет интегрироваться с remote module не публикующему навигационный элемент, например если он legacy или поставляется сторонним разработчиком.

	`navigation` задается объектом содержащим ряд конфигураций.

	```
		"navigation": {
			"route": {
				"path": "module-a"
			},
			"component": {
				"type": "ModuleANavComponent",
				"remoteEntry": "http://localhost:3000/remoteEntry.js",
				"exposedModule": "./Component"
			}
		}
	```

	* `route` описание route для lazy load сборки модуля
		* `path` обязательная характеристика задающая строкой route
		* `params` карта path параметров (_optional_)
		* `queries` карта условных параметров (_optional_)
	* `component` описание элемента для представления в навигации
		* Может быть представлен конфигурацией использующей remote `component` и в данном случае описывается радом свойств.
			* `type` название класса компонента из remote модуля который будет использоваться в качестве навигационного элемента

				⚠️ Рекомендуется оформлять как __standalone__ компонент
				```
					@Component({
						selector: 'module-a-nav'
						standalone: true
						...
					})
					export class ModuleANavComponent {}
				```

			* `remoteEntry` публичный адрес размещения сгенерированного файла декларации модуля содержащего навигационный элемент.
			* `exposedModule` наименование секции размещения навигационного элемента в экспозиции.

				```
					exposes: {
						"./Module": "./examples/example-module-a/src/app/app.module.ts"
						"./Component": "./examples/example-module-a/src/app/components/nav/nav.component.ts"
					}
				```
		* Может быть представлен конфигурацией использующей `template`

			В данном случае описывается текстовым представлением шаблона напрямую в конфигурационном файле. И предоставляет возможность задания индивидуального значения каждому экземпляру развертывания силами devops.

			```
				"component": "<span>to <b>reAct-B</b></span>"
			```

### Управление доступностью навигации к модулю, в зависимости от контекста или состояния

В конфигурационном файле манифеста модулей `{manifest_name}.json` активность модуля и его навигации, может быть установлена в три состояния 'on' | 'off' | 'promise'.

```
	"module-b": {
		"state": "on | off | promise"
		...
	}
	...
```

* `on` - модуль активен сразу и будет доступен сразу после загрузки инициированной активацией маршрута
* `off` - навигация к модулю не будет доступна и маршруты для активации модуля не будут опубликованы
* `promise` - навигация к модулю будет разблокировано если будет найдено и выполнено положительно обещание активации, публикуемое по token в DI

	```
		providers: [{
			provide: CXRA_MODULE_OPTIONS,
			useFactory: (_http: HttpClient) => ({
				['module-a']: {
					state: new Promise<boolean>((resolve) => {
						_http.get<...>(...).pipe(
							map(user => user.permissions.has(...)),
							...
							takeUntil(...)
						).subscribe(() => resolve(true));
					})
				}
			}),
			deps: [HttpClient],
			multi: true
		}, ...],
	```

_@see cxra.module.federation.navigation.RemoteModuleState_

### Публикация пользовательских событий модуля

Для публикации реализации возможности отображения факта наличия ии самих пользовательских уведомлений remote module в навигационной части приложения в едином стиле, предусмотрена возможность опубликовать источник событий через контракт __CXRA_MODULE_OPTIONS__ как в непосредственном модуле, так и в локализованном приложении потребителе. Тем самым инвертированная устранив зависимость на предоставление модулю интерфейсов для непосредственного размещения элементов в обобщенной части интерфейса приложения.

Для каждого модуля имеющего оповещения в его секции публикуется:
	
* `events` - представляющий реализацию _Observable<Array<TEvent>>_

	```
		providers: [{
			provide: CXRA_MODULE_OPTIONS,
			useFactory: (...) => ({
				['module-a']: {
					...
					events: new BehaviorSubject<unknown>(...)
				}
			}),
			deps: [...],
			multi: true
		}]
	```

## Общие настройки

Для задания общих настроек навигации и менеджмента remote modules определен контракт __CXRA_MODULE_NAVIGATOR_OPTIONS__ обладающий рядом характеристик.

* `undefined.component` предназначена для определения компонента который будет использован в случае перехода к неопределенному элементу маршрутизации, в случае необходимости задания такого поведения централизовано

	```
		providers: [{
			provide: CXRA_MODULE_NAVIGATOR_OPTIONS,
			useValue: {
				undefined: {
					component: UnfoundComponent
				}
			}
		}],
	```

## Examples

This repository provides examples of an application using this approach.

Description | Project
--- | ---
Контекст. Пример проекта используемого для публикации и обработки данных используемых между разными модулями. | examples\example-context
Module A. С примером отключения навигации модуля из самого себя. | examples\example-module-a
Module B. С примером инкапсуляции внутренних стилей и данных внешнего контекста. | examples\example-module-b
Directly the application publishes different modules and navigation. | examples\example-app

## First run

* Install packages: ``yarn install``
	
	Please note, you **must** use **yarn** during the beta phase of CLI 11 b/c it allows to override dependencies to force the CLI into webpack 5.

* Build lib`s
	
	Navigator: ``yarn build:module-federation-navigator``

### Usage

* Start all micro-frontend's and app: ``yarn start:example:navigator:all``

![let's try example](/examples/example-app/src/assets/brave-cookie.webp)

## More

More [about Module Federation](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md)
