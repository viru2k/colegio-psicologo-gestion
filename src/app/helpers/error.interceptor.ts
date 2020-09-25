import { AuthenticationService } from './../services/authentication.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            try {

            } catch (error) {

            }
            console.log(String(err.status));
            const reserr = String(err.status);
            if (reserr === '401') {
                console.log('error');
         /*        swal({
                    text: 'Su sesión expirado',
                    title: 'Sesión vencida o invalida',
                    // tslint:disable-next-line: max-line-length
                    footer: 'No realizó acciones durante un largo periodo de tiempo, y su sesion a expirado. sera reenviado al menu de inicio',
                    showConfirmButton: false,
                    timer: 3000,
                    imageUrl: 'https://img.icons8.com/clouds/100/000000/imac-exit.png',
                    onClose: () => {
                        this.authenticationService.logout();
                        this.router.navigateByUrl('/incio');
                        window.location.reload();
                    },
                    backdrop: `
                    rgba(26, 188, 156,0.7)
                    no-repeat `
                  }); */
                  console.log('intentando cerrar sesion');
                  this.authenticationService.logout();
                  this.router.navigateByUrl('/inicio');
                  window.location.reload();
                if (this.router.url === '/inicio') {
                    
                } else {
                 
                    }
                console.log('error en la autenticacion');
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
      }
