import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl:  './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login();
  }
}