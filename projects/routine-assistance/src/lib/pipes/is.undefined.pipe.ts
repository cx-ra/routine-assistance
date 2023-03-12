import { Pipe, PipeTransform } from '@angular/core';

/** Проверяет является ли значение неопределенным или null */
@Pipe({
	name: 'isND'
})
export class IsUndefinedPipe implements PipeTransform {

	transform(value: unknown): boolean {
		return Object.isND(value);
	}

}