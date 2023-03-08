export {};

declare global {
	
	interface ObjectConstructor {
		/** Метод осуществляет не глубокое сравнение объектов */
		shallow: (a: unknown, b: unknown) => boolean;
		/** Проверка на null и undefined */
		isD: (value: unknown) => boolean;
		/** Проверка на null и undefined */
		isND: (value: unknown) => boolean;
		/** Метод осуществляет копирование объекта */
		getClone: (o: unknown) => unknown;
	}
	
}

Object.shallow = (a, b): boolean => {
	const keys1 = Object.keys(a);
	const keys2 = Object.keys(b);
	if (keys1.length !== keys2.length) {
		return false;
	}
	for (const key of keys1) {
		if (a[key] !== b[key]) {
			return false;
		}
	}
	return true;
};

Object.isD = (value): boolean => !Object.isND(value);

Object.isND = (value): boolean => (value === undefined || value === null);

Object.getClone = (o: unknown): string => JSON.parse(JSON.stringify(o));