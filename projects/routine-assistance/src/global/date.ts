/* eslint-disable */

import { DateConcept } from './date.concept';

export { };

declare global {
	
	interface DateConstructor {
		formats: {
			/** DD.MM.YYYY */
			withoutTime: string;
			/** HH:mm:ss */
			withoutDate: string;
			/** DD.MM.YYYY HH:mm */
			withHHMMTime: string;
			/** DD.MM.YYYY HH:mm:ss */
			withHHMMSSTime: string;
		};
		HOURS_PER_DAY: number;
		MINUTES_PER_HOUR: number;
		SECONDS_PER_MINUTE: number;
		/** Метод определения является значение абстрактным понятием даты */
		isConcept: (value: unknown) => boolean;
		/** Метод получения значения абстрактного понятия даты */
		getConceptValue: (value: DateConcept) => Date;
	}

	interface Date {
		addMilliseconds: (value: number) => Date;
		addSeconds: (value: number) => Date;
		addMinutes: (value: number) => Date;
		addHours: (value: number) => Date;
		addDays: (value: number) => Date;
		addWeeks: (value: number) => Date;
		addMonths: (value: number) => Date;
		addYears: (value: number) => Date;
	}

}

Date.formats = {
	withoutTime: 'DD.MM.YYYY',
	withHHMMTime: 'DD.MM.YYYY HH:mm',
	withHHMMSSTime: 'DD.MM.YYYY HH:mm:ss',
	withoutDate: 'HH:mm:ss'
};

Date.HOURS_PER_DAY = 24;
Date.MINUTES_PER_HOUR = 60;
Date.SECONDS_PER_MINUTE = 60;

Date.isConcept = (value: unknown) => Object
	.values(DateConcept)
	.some(o => o === value);
	
Date.getConceptValue = (value: DateConcept) => {
	switch (value) {
		case DateConcept.age:
			return (new Date()).addYears(-110);
		case DateConcept.lastyear:
			return (new Date()).addYears(-1);
		case DateConcept.yesterday:
			return (new Date()).addDays(-1);
		case DateConcept.now:
			return new Date();
		case DateConcept.tomorrow:
			return (new Date()).addDays(1);
		case DateConcept.nextyear:
			return (new Date()).addYears(1);
		default:
			return null;
	}
};

const isLeapYear = (year: number) => (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));

const getMonthLength = (date: Date) => {
	return [31, (isLeapYear(date.getFullYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
};

Date.prototype.addMilliseconds = function(value) {
	const result = new Date(this.valueOf());
	result.setMilliseconds(result.getMilliseconds() + value);
	return result;
};
Date.prototype.addSeconds = function(value) {
	return this.addMilliseconds(value * 1000);
};
Date.prototype.addMinutes = function(value) {
	return this.addMilliseconds(value * 60000);
};
Date.prototype.addHours = function(value) {
	return this.addMilliseconds(value * 3600000);
};
Date.prototype.addDays = function(value) {
	return this.addMilliseconds(value * 86400000);
};
Date.prototype.addWeeks = function(value) {
	return this.addMilliseconds(value * 604800000);
};
Date.prototype.addMonths = function(value) {
	const result = new Date(this.valueOf());
	result.setDate(1);
	result.setMonth(this.getMonth() + value);
	result.setDate(Math.min(this.getDate(), getMonthLength(result)));
	return result;
};
Date.prototype.addYears = function(value) {
	return this.addMonths(value * 12);
};