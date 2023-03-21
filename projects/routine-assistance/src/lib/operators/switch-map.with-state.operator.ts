import { Observable, pipe, UnaryFunction } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

/** Оператор переключение на подписку с фиксацией состояния исполнения */
export const switchMapWithState = <T, R>(
	_predicate: (value: T, index: number) => Observable<R>,
	_monitor: { next(value: boolean): void }
): UnaryFunction<Observable<T>, Observable<R>> => pipe(
	tap(() => _monitor.next(true)),
	switchMap((value: T, index: number) => _predicate(value, index).pipe(
		finalize(() => _monitor.next(false))
	))
);