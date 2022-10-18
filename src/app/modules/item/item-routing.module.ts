import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';
import { ItemsComponent } from './components/items/items.component';

const routes: Routes = [
    { path: 'items', component: ItemsComponent, canActivate: [AuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ItemRoutingModule { }