import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AtLeastADigitValidator } from 'src/modules/shared/validators/at-least-a-digit.validator';
import { AtLeastALowercaseValidator } from 'src/modules/shared/validators/at-least-a-lowercase.validator';
import { AtLeastASpecialCharacterValidator } from 'src/modules/shared/validators/at-least-a-special-character.validator';
import { AtLeastAnUppercaseValidator } from 'src/modules/shared/validators/at-least-an-uppercase.validator';
import { CurrentIdentityPageService } from '../../services/current-identity-page.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private service: LoginService, private currentIdentityPageService: CurrentIdentityPageService) {}
  
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
    this.service.login(this.form).subscribe({
      next: (response) => {
        this.form.reset();
        this.service.setTokens(response);
      },
      error: (error) => {
        console.log('Error found at login: ', error);
      }
    });
  }
}
