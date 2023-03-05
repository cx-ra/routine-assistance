# @cxra/module-federation-navigator

Данная библиотека, предназначена:
* Слегка облегчить работу с [Module Federation](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md) в базовых случаях.
* Автоматизировать не только управление модулями через файл конфигурации, но и управление навигацией к этим модулям и доступностью их для разных контекстов исполнения.

	`Данная потребность возникала`
	* В продуктовой разработке когда один продукт разворачивается для разных заказчиков с разной конфигурациеи.
	* Когда нужно предоставить возможность devops быстро отключать, включать и конфигурировать состав. 
* Сохранить возможность ленивой загрузки и при этом дать возможность самим модулям предоставлять компонент который будет использован в качестве навигационного элемента

## Примеры использования

В данном репозитории приведены примеры приложения использующего данный подход:
* _projects\example-module-a_
* _projects\example-module-b_
* _projects\example-app_ 

### Конфигурационный файл

бла-бла-бла...

#### Элемент навигации

В качестве элемента навигации можно указать компонент или шаблон

### Управление доступностью навигации к модулю, в зависимости от контекста или состояния

бла-бла-бла...

![example](./example.png)

## Настройка репозитория (не требующие выполнения)

* Set local dependencies
    * routine: ``yarn add file:./dist/cxra/routine``
    * navigator: ``yarn add file:./dist/cxra/module-federation-navigator``

## Первый запуск

* Install packages: ``yarn install``
	
	Please note, you **must** use **yarn** during the beta phase of CLI 11 b/c it allows to override dependencies to force the CLI into webpack 5.

* Build lib`s
	* navigator: ``yarn build:module-federation-navigator``

## Usage
* Start all micro-frontend's and app: ``start:example:all``

![let's try example](./projects\example-app\src\assets\brave-cookie.webp)

## More

More [about Module Federation](https://github.com/angular-architects/module-federation-plugin/blob/main/libs/mf/README.md)
