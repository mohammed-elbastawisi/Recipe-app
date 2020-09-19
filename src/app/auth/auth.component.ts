import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  constructor(private authService: AuthService, private router: Router) {
  }
  isLoggingMode = true;
  isLoading = false;
  error: string = null;

  // tslint:disable-next-line:typedef
  onSwitchMode() {
    this.isLoggingMode = !this.isLoggingMode;
  }

  // tslint:disable-next-line:typedef
  onSubmit(form: NgForm){
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;
    if (this.isLoggingMode){
      authObs = this.authService.logIn(email, password);
      this.error = null;
    }else {
      authObs = this.authService.signUp(email, password);
      this.error = null;
    }

    authObs.subscribe(resData => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
    });
    form.reset();
  }
}
