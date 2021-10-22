import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterRequest } from 'src/app/models/request/identity/registerRequest.model';
import { ConfirmPasswordValidator } from 'src/app/validators/confirm-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder) {}

  model: RegisterRequest = new RegisterRequest();

  form = this.fb.group({
    username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).{8,30})/)])),
    confirm_password: new FormControl('', Validators.required)
  },
  {
    validator: ConfirmPasswordValidator("password", "confirm_password")
  } as AbstractControlOptions);

  confirmPasswordValid: AbstractControl = this.form.controls["confirm_password"];

  register() {
    console.warn(this.form.value);
    this.form.reset();
  }

  match_password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirm_password');
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit() {
    this.form.get('password').valueChanges.subscribe(() => this.confirmPasswordValid.updateValueAndValidity());
  }
}

