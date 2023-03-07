import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContextService {

	public readonly user: string;

	constructor() {
		this.user = 'brave cookie!';
	}

}