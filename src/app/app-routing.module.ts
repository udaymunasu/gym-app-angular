import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRegistrationComponent } from './create-registration/create-registration.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'register' },
  { path: 'register', component: CreateRegistrationComponent },
  { path: 'update/:id', component: CreateRegistrationComponent },
  { path: 'detail/:id', component: UserDetailsComponent },
  { path: 'list', component: RegistrationListComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
