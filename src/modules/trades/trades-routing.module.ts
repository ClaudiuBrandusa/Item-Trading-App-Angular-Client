import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/modules/app/guards/auth-guard.service';
import { TradesPageComponent } from './components/trades-page/trades-page.component';

const routes: Routes = [
    { path: 'trades', component: TradesPageComponent, canActivate: [AuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TradesRoutingModule { }