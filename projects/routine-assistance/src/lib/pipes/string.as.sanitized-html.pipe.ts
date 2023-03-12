import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** Is meant to be sanitized to declarative html for use in a template */
@Pipe({
	name: 'asSanitizedHtml'
})
export class StringAsSanitizedHtmlPipe implements PipeTransform {

	constructor(
		private sanitized: DomSanitizer
	) {}

	transform(value: string): SafeHtml {
		return this.sanitized.bypassSecurityTrustHtml(value);
	}

}