import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { unauthGuard } from 'src/modules/app/guards/unauth-guard.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IdentityRoutes } from './enums/identity-routes';

const routes: Routes = [
  {
    path: IdentityRoutes.Login,
    component: LoginComponent,
    canActivate: [unauthGuard]
  },
  {
    path: IdentityRoutes.Register,
    component: RegisterComponent,
    canActivate: [unauthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
