import { Component } from '@angular/core';

import { User } from './_models';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'coupon-talk-talk';

  sidebar = {
    sidebarToggled: false,
    toggled: false
  };

  constructor() { }
}
