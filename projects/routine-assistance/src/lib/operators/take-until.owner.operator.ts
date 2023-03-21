import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { Observable, Subject, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** Operator to stop subscription with the owner destroyed */
export function takeUntilOwner<T>(): UnaryFunction<Observable<T>, Observable<T>> {
	const _owner = inject(ChangeDetectorRef) as ViewRef;
	const _destroyed$ = new Subject<void>();
	_owner.onDestroy(() => _destroyed$.next());
	return (o: Observable<T>) => o.pipe(
		takeUntil(_destroyed$)
	);
}