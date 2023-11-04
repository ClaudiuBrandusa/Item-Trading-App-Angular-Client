import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AtLeastADigitValidator } from 'src/modules/shared/validators/at-least-a-digit.validator';
import { AtLeastALowercaseValidator } from 'src/modules/shared/validators/at-least-a-lowercase.validator';
import { AtLeastASpecialCharacterValidator } from 'src/modules/shared/validators/at-least-a-special-character.validator';
import { AtLeastAnUppercaseValidator } from 'src/modules/shared/validators/at-least-an-uppercase.validator';
import { CurrentIdentityPageService } from '../../services/current-identity-page.service';
import { LoginRequest } from 'src/modules/identity/models/requests/login-request.model';
import { Store } from '@ngrx/store';
import { loginInit } from '../../store/identity/identity.actions';
import { selectConnected } from '../../store/identity/identity.selector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private currentIdentityPageService: CurrentIdentityPageService, private store: Store) {
    this.store.select(selectConnected).subscribe(connected => {
      if (connected) {
        this.form.reset();
      }
    })
  }
  
  ngOnInit() {
    this.currentIdentityPageService.setPage(0);
  }

  form = this.fb.group({
    username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])),
    password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)]))
  },
  {
    validators: [
      AtLeastAnUppercaseValidator("password"),
      AtLeastALowercaseValidator("password"),
      AtLeastADigitValidator("password"),
      AtLeastASpecialCharacterValidator("password")
    ]
  } as AbstractControlOptions);

  login() {
    this.store.dispatch(loginInit(this.form2LoginRequest()));
  }

  private form2LoginRequest() {
    var model = new LoginRequest();
    model.username = this.form.get('username')?.value;
    model.password = this.form.get('password')?.value;
    return model;
  }
}
