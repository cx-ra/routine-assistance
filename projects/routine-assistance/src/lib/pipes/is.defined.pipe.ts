import { Pipe, PipeTransform } from '@angular/core';

/** Проверяет является ли значение определенным */
@Pipe({
	name: 'isD'
})
export class IsDefinedPipe implements PipeTransform {

	transform(value: unknown): boolean {
		return Object.isD(value);
	}

}