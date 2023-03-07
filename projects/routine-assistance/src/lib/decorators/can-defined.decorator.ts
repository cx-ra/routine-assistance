/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/require-await */

/**
 * Декоратор, который оборачивает функцию setter'а в if (value),
 * то есть setter будет срабатывать только если значение не undefined и не null
 * 
 * @example
 * 	@Input('id')
 * 	@ShouldByDefined()
 * 	private set _accountId(value: number) {
 * 		this.id$.next(value);
 * 	}
 * 	Тоже самое:
 * 	@Input('id')
 * 	private set _accountId(value: number) {
 * 		if(value) {
 * 			this.id$.next(value);
 * 		}
 * 	}
 */
export const ShouldByDefined = () => (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {

	const setter = descriptor.set;

	descriptor.set = async function(...args: unknown[]): Promise<unknown> {
		if (args[0]) {
			return setter?.apply(this, args);
		}
		return null;
	};
	return descriptor;

};