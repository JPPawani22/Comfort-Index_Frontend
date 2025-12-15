import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl:  './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  user$;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.getUser$();
  }

  logout(): void {
    this.authService.logout();
  }
}