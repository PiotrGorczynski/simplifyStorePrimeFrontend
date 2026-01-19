import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ActionType = 'show' | 'insert' | 'update' | 'delete' | 'exportPdf' | 'exportExcel' | 'grid' | 'code' | 'database' | 'logout';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private actionSubject = new Subject<ActionType>();

  action$: Observable<ActionType> = this.actionSubject.asObservable();

  emitAction(action: string): void {
    this.actionSubject.next(action as ActionType);
  }
}


























