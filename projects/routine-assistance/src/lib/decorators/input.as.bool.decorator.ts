/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/require-await */
/**
 * Декоратор, который оборачивает функцию setter'а в обработчик, который входной аргумент поступивший
 * (например из шаблона) возможно в виде строки, пытается привести к @see bool
 * 
 * @example
 *	@Input('can')
 *	@InputAsBool()
 *	private set _can(value: boolean) {
 *		this.can$.next(value);
 *	}
 */
export const InputAsBool = () => (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {

	const setter = descriptor.set;

	descriptor.set = async function(...args: unknown[]): Promise<unknown> {
		const _argument = args[0];
		args[0] =_argument === '' || _argument === 'true'
			? true
			: _argument === 'false'
				? false
				: _argument;
		return setter?.apply(this, args);
	};
	return descriptor;

};