# @cxra/routine-assistance

# @cxra/angular-assistance

# @cxra/module-federation-navigator

Данная библиотека, предназначена:
* Слегка облегчить работу с [Module Federation](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md) в базовых случаях.
* Автоматизировать не только управление модулями через файл конфигурации, но и управление навигацией к этим модулям и доступностью их для разных контекстов исполнения.

	`Данная потребность возникала`
	* В продуктовой разработке когда один продукт разворачивается для разных заказчиков с разной конфигурациеи.
	* Когда нужно предоставить возможность devops быстро отключать, включать и конфигурировать состав. 
* Сохранить возможность ленивой загрузки и при этом дать возможность самим модулям предоставлять компонент который будет использован в качестве навигационного элемента

## Примеры использования

В данном репозитории приведены примеры приложения использующего данный подход.
Описание | Проект
--- | ---
Контекст. Пример проекта используемого для публикации и обработки данных используемых между разными модулями. | examples\example-context
Module A. С примером отключения навигации модуля из самого себя. | examples\example-module-a
Module B. С примером инкапсуляции внутренних стилей и данных внешнего контекста. | examples\example-module-b
Непосредственно приложение публикующее разные модули и навигацию. | examples\example-app

Для запуска группы проектов используйте команду `yarn start:example:navigator:all`

### Конфигурационный файл

бла-бла-бла...

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

## Настройка репозитория (не требующие выполнения)

* Set local dependencies
    * routine: ``yarn add file:./dist/ngcx/routine``
    * navigator: ``yarn add file:./dist/ngcx/module-federation-navigator``

## Первый запуск

* Install packages: ``yarn install``
	
	Please note, you **must** use **yarn** during the beta phase of CLI 11 b/c it allows to override dependencies to force the CLI into webpack 5.

* Build lib`s
	* navigator: ``yarn build:module-federation-navigator``

## Usage
* Start all micro-frontend's and app: ``start:example:all``

![let's try example](/examples/example-app/src/assets/brave-cookie.webp)

## More

More [about Module Federation](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md)
