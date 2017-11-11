import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public loading: boolean;
  public signinForm: FormGroup;
  public message: any;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loading = false;
    localStorage.removeItem('_userToken');
    this.signinForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]]
    });
  }

  signin(form: FormGroup) {
      this.loading = true;
      const user = {
        email: form.value.email,
        password: form.value.password
      };

      this.api.signin(user).subscribe(data => {
          this.loading = false;
          localStorage.setItem('_userToken', data['response']);
          this.message = {
            type: 'success',
            message: 'Logged in successfully! Redirecting...'
          };
          this.api.getToken();
          this.router.navigateByUrl('/dashboard');

      }, err => {
          this.loading = false;
          this.message = {
            type: 'danger',
            message: 'Invalid credentials!'
          };
      });
  }
}
