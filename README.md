# @cxra/routine-assistance

# @cxra/angular-assistance

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

	Данное решение предоставляет возможность самому модулю запубликовать навигационный элемент, компонент который будет использован для отображения в меню, инвертировав данную зависимость из основного приложения.

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
	* `component` описание компонента для представления в навигации
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

Инвертированная публикация уведомлений о своих пользовательских событий

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
