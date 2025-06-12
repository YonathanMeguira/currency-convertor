import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StateService } from './services/state.service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private state = inject(StateService);
  history$: Observable<number> = this.state.getHistory().pipe(map((history) => history.length));
}
