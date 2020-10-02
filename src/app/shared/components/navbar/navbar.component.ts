
import { AuthenticationService } from './../../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from './../../../models/user.model';
import { UserService } from './../../../services/user.service';
import swal from 'sweetalert2';

import { DialogService } from 'primeng/components/common/api';
import { DatePipe } from '@angular/common';
import { AlertServiceService } from './../../../services/alert-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [MessageService, DialogService, DatePipe]
})
export class NavbarComponent implements OnInit {

  user: User;
  loggedIn = false;
  general: MenuItem[];
  mantenimiento = true;
  matricula  = true;
  tesoreria  = true;
  contabilidad = true;
  presidencia = true;
  


  public username: string;
  public puesto: string;
  public name: string;
  public email: string;
  elemento: User = null;




  returnUrl: string;
  error = '';
  notificaciones = 0;
  chats;
  currentUser = null;

  constructor(
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private miServico: UserService) {

  }
 navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  ngOnInit() {
      
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     console.log(this.currentUser);
     if (this.currentUser) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      console.log(userData);
      console.log('usuario logueado');
      this.username = userData.username;
      this.name = userData.name;
      this.email = userData.email;
      console.log(userData.access_list);
      this.asignarModulos(userData.access_list);
   } else {
    this.router.navigate(['/login']);
   }

  }



  asignarModulos(modulos: any) {
    modulos.forEach(element => {
     // console.log(element['modulo_nombre']);
      if (element.modulo_nombre === 'mantenimiento') {
        this.mantenimiento = false;
      }
      if (element.modulo_nombre === 'matricula') {
        this.matricula = false;
      }
      if (element.modulo_nombre === 'tesoreria') {
        this.tesoreria = false;
        console.log( element.modulo_nombre);
      }
      if (element.modulo_nombre === 'contabilidad') {
        this.contabilidad = false;
      }
      if (element.modulo_nombre === 'presidencia') {
        this.presidencia = false;
      }
      
  
    });
  
    /** DESPUES DE ASIGNAR MODULOS VERIFICO LAS NOTIFICACIONES */
  
  }

accion(evt: any, overlaypanel: OverlayPanel) {

  console.log(evt);
  overlaypanel.toggle(evt);
}


cerrarSesion() {

  swal({
  title: 'Cerrando sesión',
  text: '¿Desea finalizar la sesión actual?',
  showCancelButton: true,
  confirmButtonColor: '#E53935',
  cancelButtonColor: '#42A5F5',
  cancelButtonText: 'Permanecer',
  confirmButtonText: 'Cerrar sesión',
  imageUrl: 'https://img.icons8.com/clouds/100/000000/imac-exit.png',
  imageHeight: 128,
  imageWidth: 128,
}).then((result) => {
  if (result.value) {

  console.log('sesion terminada');
  this.authenticationService.logout();
  this.loggedIn = false;
  this.mantenimiento = true;
  this.matricula = true;
  this.tesoreria = true;
  this.contabilidad = true;
  this.presidencia = true;
  this.user = null;
  this.elemento = null;
  localStorage.removeItem('userData');
  window.location.reload();
  }
});
}




ver() {
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
console.log(currentUser.access_token);
}


/* 
menuList() {

  this.general = [
    {label: 'Matrícula', routerLink: '/matricula'},
   
    {

      label: 'Liqudación',
     
      items: [
        {
          label: 'Liquidación detalle',
          visible: !this.contabilidad,
          items: [
            {label: 'Historico de pagos', routerLink: '/insumo/stock/ingreso'},
            {label: 'Detalle de liquidación', routerLink: '/insumo/stock'},
            {label: 'Acciones sobre liquidación', routerLink: '/insumo/indicadores'},
          ]
      },
        {
            label: 'Tesoreria',
            visible: !this.tesoreria,
            items: [
              {label: 'Movimientos caja',  routerLink: 'orden/produccion'},
              {label: 'Detalle de ordenes de producción', routerLink: '/produccion/ingreso'},
              {label: 'Proceso de producción', routerLink: '/produccion/proceso'},
            ]
        },
        {
          label: 'Contabilidad',
          visible: !this.contabilidad,
          items: [
            {label: 'Archivo Banco San Juan', routerLink: 'produccion/ingreso'},
            {label: 'Archivo Empleados', routerLink: 'produccion/asociar/insumo'},
            {label: 'Estados contables', routerLink: 'produccion/movimientos'},
            {label: 'Cierre de caja', routerLink: 'insumo/movimientos'},
          ]
      },

      ]
  },

  {
    label: 'Tesoreria',
    visible: !this.contabilidad,
    items: [
      {label: 'Movimientos caja',  routerLink: 'orden/produccion'},
      {label: 'Orden de cobro', routerLink: 'gerencia/insumo'},
      {label: 'Detalle de cobro', routerLink: 'gerencia/insumo'},
    ]
  },

  {
    label: 'Presidencia',
    items: [
      {label: 'Informes', routerLink: 'orden/produccion'},
      {label: 'Estado de sitación', routerLink: 'gerencia/insumo'},
    ]
  },



  {

    label: 'Mantenimiento',
    visible: !this.mantenimiento,
    items: [
      {
            label: 'Parametros',
       
            items: [
              {label: 'Conceptos', routerLink: 'mantenimiento/articulo'},
              {label: 'Comprobantes', routerLink: 'mantenimiento/insumo'},
              {label: 'Plan de cuenta', routerLink: 'mantenimiento/articulo/confeccion'},
            ]
        },
        {
            label: 'Obra social',
            items: [
              {label: 'Obra social', routerLink: 'mantenimiento/obra/social'},
              {label: 'PMO', routerLink: 'mantenimiento/pmo'},
              {label: 'Convenios', routerLink: 'mantenimiento/convenio'}
          ]
      },
      {
       label: 'Usuario',

      routerLink: 'usuario'},
    ]
  }

];


} */



}






