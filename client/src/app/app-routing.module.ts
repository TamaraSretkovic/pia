import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { LoginGuard } from './guard/login.guard';
import { RegistrationComponent } from './components/registration/registration.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'admin', component: AdminComponent //,  canActivate: [LoginGuard]
  },
  {
    path: 'registration', component: RegistrationComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
