import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

// import { UserGuard } from '../services/user.guard';

const messagesRoutes: Routes = [
  {
    path: 'messages',
    component: MainComponent,
    children: [
      /* {path: '', redirectTo: 'received', pathMatch: 'full'},
      {path: 'send', component: AddComponent, canActivate: [UserGuard]},
      {path: 'received', component: ReceivedComponent, canActivate: [UserGuard]},
      {path: 'received/:page', component: ReceivedComponent, canActivate: [UserGuard]},
      {path: 'sending', component: SendedComponent, canActivate: [UserGuard]},
      {path: 'sending/:page', component: SendedComponent, canActivate: [UserGuard]} */
      {path: '', redirectTo: 'received', pathMatch: 'full'},
      {path: 'send', component: AddComponent},
      {path: 'received', component: ReceivedComponent},
      {path: 'received/:page', component: ReceivedComponent},
      {path: 'sending', component: SendedComponent},
      {path: 'sending/:page', component: SendedComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(messagesRoutes)],
  exports: [RouterModule]
})
export class MessagesRouting { }
