import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HistoryComponent } from './views/history/history.component';
import { ConvertComponent } from './views/convert/convert.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'convert',
        pathMatch: 'full'
    },
    {
        path: 'convert',
        component: ConvertComponent
    },
    {
        path: 'history',
        component: HistoryComponent
    }
];
