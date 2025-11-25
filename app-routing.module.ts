import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards';
import { Role } from './_models';



const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('src/app/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
    loadChildren: () => import('src/app/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'merchant',
    canActivate: [AuthGuard],
    data: { roles: [Role.Merchant] },
    loadChildren: () => import('src/app/merchant/merchant.module').then(m => m.MerchantModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
