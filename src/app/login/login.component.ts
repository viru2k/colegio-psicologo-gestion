import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import swal from 'sweetalert2';
import * as $ from 'jquery';
import { AlertServiceService } from './../services/alert-service.service';
import { DialogService } from 'primeng/components/common/api';
import { AuthenticationService } from './../services/authentication.service';
import { UserService } from './../services/user.service';
import { User } from './../models/user.model';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService, DialogService, DatePipe]
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;
  submitted = false;
  elemento: User = null;
  loading = false;
  loadingmensaje: string;
  loadingerror;
  elementoModulo:[] = null;
  numero = 1;

  public username: string;
  public puesto: string;
  public name: string;
  public email: string;
  error = '';

  constructor(    private alertServiceService: AlertServiceService,
                  public dialogService: DialogService,
                  private authenticationService: AuthenticationService,
                  private formBuilder: FormBuilder,
                  private route: ActivatedRoute,
                  private router: Router,
                  private miServico: UserService) { }

  ngOnInit() {
    this.calcularRandom();
   this.patametrizarJQuery();

   this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

   const currentUser = JSON.parse(localStorage.getItem('currentUser'));

   if (currentUser) {
     const userData = JSON.parse(localStorage.getItem('userData'));
     console.log(userData);
     console.log('usuario logueado');
     this.username = userData.username;
     this.name = userData.name;
     this.email = userData.email;
     this.router.navigate(['/']);
  }
  }



  patametrizarJQuery() {
       /*======== JQUERY DEL LOGUIN =========*/
   $(document).ready
   (function ($) {
     'use strict';

     /*==================================================================
     [ Focus Contact2 ]*/
     $('.input100').each(function() {
         $(this).on('blur', function() {
             if ($(this).val() !== '') {
                 $(this).addClass('has-val');
             } else {
                 $(this).removeClass('has-val');
             }
         })
     })

     /*==================================================================
     [ Validate ]*/
     let input = $('.validate-input .input100');

     $('.validate-form').on('submit',function() {
         let check = true;

         for(let i=0; i<input.length; i++) {

         }
         return check;
     });


     $('.validate-form .input100').each(function() {
         $(this).focus(function() {
            hideValidate(this);
         });
     });

     function showValidate(input) {
         let thisAlert = $(input).parent();
 
         $(thisAlert).addClass('alert-validate');
     }
     function hideValidate(input) {
         let thisAlert = $(input).parent();
         $(thisAlert).removeClass('alert-validate');
     }


 });
 
      /*======== FIN JQUERY DEL LOGUIN =========*/
  }

  get f() { return this.loginForm.controls; }

   onSubmit() {
  this.submitted = true;
  if (this.loginForm.invalid) {
      return;
  }
   }


login() {
  
this.loading = true;
this.loadingmensaje = 'Validando usuario';
this.authenticationService.login(this.f.username.value, this.f.password.value)
     // .pipe(first())
      .subscribe(
          data => {
            console.log(data);
            this.user = data;
            const us = new User('', '', '', '', '', this.f.username.value, this.f.password.value, []);
            localStorage.setItem('userData', JSON.stringify(us));
            localStorage.setItem('currentUser', JSON.stringify(this.user));
            //  this.router.navigate([this.returnUrl]);
            this.loadUser();
          },
          error => {
            console.log(error);
            if (error === 'Las credenciales del usuario son incorrectas') {
              this.loadingerror = true;
              this.loading = false;
              this.loadingmensaje = '';
             } else {
              this.loading = false;
              this.loadingmensaje = '';
            }
            this.error = error;
          });
}



loadUser() {

  this.loading = true;
  try {
    this.loadingmensaje = 'Obteniendo modulos del usuario';
    this.miServico.getItemInfoAndMenu(this.f.username.value)
      .subscribe(resp => {
      this.elemento = resp;
      const currentUser =  JSON.parse(localStorage.getItem('currentUser'));
      const userData = JSON.parse(localStorage.getItem('userData'));
      console.log(this.elemento);
      this.elementoModulo = <any>this.elemento;
      this.user = new User(this.elemento[0].id , this.elemento[0].email, this.elemento[0].nombreyapellido,
      this.elemento[0].name, this.elemento[0].admin, this.elemento[0].email, currentUser.access_token, this.elementoModulo);
      this.username = userData['username'];
      localStorage.removeItem('userData');
      localStorage.setItem('userData', JSON.stringify(this.user));
      this.loading = false;
      this.loadingmensaje = '';
      console.log('logueado');
      this.router.navigate(['/']);
      window.location.reload();
      // envio a menu /

      },
      error => {
          console.log(error.message);
          console.log(error.status);
          localStorage.removeItem('error');
          localStorage.setItem('error', JSON.stringify(error));
          this.loadingmensaje = '';

       });
  } catch (error) {
  }
  }

  calcularRandom() {
    this.numero = Math.floor(Math.random() * 6) + 1;
    console.log(Math.floor(Math.random() * 6) + 1 );
  }

}
