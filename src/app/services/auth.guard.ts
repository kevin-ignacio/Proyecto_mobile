import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
      const isAuthenticated = await this.authService.isLoggedIn();
      if (isAuthenticated) {
        return true;
      } else {
        return this.router.parseUrl('/login'); // Redirige a la página de inicio de sesión si no está autenticado
      }
    }
}