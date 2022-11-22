import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/guards/auth-guard.service";
import { MainPageComponent } from "./components/main-page/main-page.component";

const routes: Routes = [
    { path: '', component: MainPageComponent, canActivate: [AuthGuardService], pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndexRoutingModule { }