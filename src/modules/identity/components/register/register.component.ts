import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AtLeastADigitValidator } from 'src/modules/shared/validators/at-least-a-digit.validator';
import { AtLeastALowercaseValidator } from 'src/modules/shared/validators/at-least-a-lowercase.validator';
import { AtLeastASpecialCharacterValidator } from 'src/modules/shared/validators/at-least-a-special-character.validator';
import { AtLeastAnUppercaseValidator } from 'src/modules/shared/validators/at-least-an-uppercase.validator';
import { ConfirmPasswordValidator } from 'src/modules/shared/validators/confirm-password.validator';
import { CurrentIdentityPageService } from '../../services/current-identity-page.service';
import { RegisterRequest } from 'src/modules/identity/models/requests/register-request.model';
import { Store } from '@ngrx/store';
import { selectConnected } from '../../store/identity/identity.selector';
import { registerInit } from '../../store/identity/identity.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private currentIdentityPageService: CurrentIdentityPageService, private store: Store) {
    this.store.select(selectConnected).subscribe(connected => {
      if (connected) {
        this.form.reset();
      }
    });
  }

  form = this.fb.group({
    username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
    email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])),
    confirm_password: new FormControl('', Validators.required)
  },
  {
    validators: [
      AtLeastAnUppercaseValidator("password"),
      AtLeastALowercaseValidator("password"),
      AtLeastADigitValidator("password"),
      AtLeastASpecialCharacterValidator("password"),
      ConfirmPasswordValidator("password", "confirm_password")
    ]
  } as AbstractControlOptions);

  confirmPasswordValid: AbstractControl = this.form.controls["confirm_password"];

  register() {
    this.store.dispatch(registerInit(this.form2RegisterRequest()))
  }

  match_password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirm_password');
    return password === confirmPassword ? null : { mismatch: true };
  }

  ngOnInit() {
    this.form.get('password')?.valueChanges.subscribe(() => this.confirmPasswordValid.updateValueAndValidity());
  
    this.currentIdentityPageService.setPage(1);
  }

  private form2RegisterRequest() {
    var model = new RegisterRequest();
    model.username = this.form.get('username')?.value;
    model.email = this.form.get('email')?.value;
    model.password = this.form.get('password')?.value;
    model.confirmPassword = this.form.get('confirm_password')?.value;
    return model;
  }
}

