import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from 'src/modules/app/guards/auth-guard.service';
import { InventoryComponent } from './components/inventory/inventory.component';

const routes: Routes = [
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }