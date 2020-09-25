import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { AlertServiceService } from './../../../services/alert-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.scss']
})
export class UsuarioEditarComponent implements OnInit {

  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  esNuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  esAdministrador;
  editarPassword;

  constructor(public config: DynamicDialogConfig, private userService: UserService,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

    this.updateDataForm = new FormGroup({
      'id': new FormControl('', ),
      'name': new FormControl('', Validators.required),
      'nombreyapellido': new FormControl('', Validators.required),
      'email': new FormControl(''),
      'password': new FormControl(''),
      'admin': new FormControl('1', )

  });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.esNuevo = false;
      if (this.config.data.editaPassword === 'SI' ) {
        this.editarPassword = true;
      } else {
        this.editarPassword = false;
      }
/* --------------------- marco si es administrador o no --------------------- */

      if (this.config.data.admin  === 2) {
        this.esAdministrador = true;
      } else {
        this.esAdministrador = false;
      }
      this.updateDataForm.patchValue({id: this.config.data.id});
      this.updateDataForm.patchValue({name: this.config.data.name});
      this.updateDataForm.patchValue({nombreyapellido: this.config.data.nombreyapellido});
      this.updateDataForm.patchValue({email: this.config.data.email});
      this.updateDataForm.patchValue({admin: this.config.data.admin});
      console.log(this.updateDataForm);
    }else{
      this.editarPassword = false;
      this.esNuevo = true;
      console.log('es nuevo');
    }
  }




  guardarDatos() {

/* ----------------- verifico si el usuario es administrador ---------------- */
    if (this.esAdministrador) {
      this.updateDataForm.patchValue({admin: '2'});
    } else {
      this.updateDataForm.patchValue({admin: '1'});
    }

    if (this.esNuevo) {
      this.crearUsuario();
    } else {

      if (this.editarPassword) {
        this.modificarPassword();
      } else {
        this.modificarUsuario();
      }
    }
  }

  crearUsuario() {

    this.loading = true;
    this.updateDataForm.patchValue({name: this.updateDataForm.value.email});
    try {
      this.userService.setUser(this.updateDataForm.value)
      .subscribe(resp => {
          this.loading = false;
          console.log(resp);
          this.ref.close(resp);
      },
      error => { // error path
        console.log(error);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
     });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
}
  }

  modificarUsuario() {

    console.log(this.updateDataForm.value['id']);
  
    console.log(this.updateDataForm);
    try {
        this.userService.updUser(this.updateDataForm.value.id, this.updateDataForm.value )
        .subscribe(resp => {
          this.loading = false;
          console.log(resp);
          this.ref.close(resp);
        },
        error => { // error path
          console.log(error);
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
       });
  } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
  }
  }

  modificarPassword() {
        
    
        try {
          this.userService.EditarUsuarioPassword(this.updateDataForm.value.id, this.updateDataForm.value)
          .subscribe(resp => {
            this.loading = false;
            console.log(resp);
            this.ref.close(resp);
          },
          error => { // error path
            console.log(error);
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
        });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
    }
  }


