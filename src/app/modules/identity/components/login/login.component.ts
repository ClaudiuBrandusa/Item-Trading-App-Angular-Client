import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private service: LoginService) {
    
  }

  form = new FormGroup({
    username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,30})/)]))
  })

  login() {
    this.service.login(this.form);
    this.form.reset();
  }

}
