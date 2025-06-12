import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { CurrencySwitchOperation } from '../../models/currency';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  private state = inject(StateService);
  history$: Observable<CurrencySwitchOperation[]> = this.state.getHistory();


}
