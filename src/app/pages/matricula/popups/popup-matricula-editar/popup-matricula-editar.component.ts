import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, MessageService, DynamicDialogRef, DialogService } from 'primeng/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import { calendarioIdioma } from './../../../../config/config';
import { MatriculaService } from './../../../../services/matricula.service';
@Component({
  selector: 'app-popup-matricula-editar',
  templateUrl: './popup-matricula-editar.component.html',
  styleUrls: ['./popup-matricula-editar.component.scss']
})
export class PopupMatriculaEditarComponent implements OnInit {
  esEditable = false;
  es: any;
  formasPago: any[];
  updateDataForm: FormGroup;
  esEditar = false;

  constructor(public matriculaService:MatriculaService, public config: DynamicDialogConfig, private alertServiceService: AlertServiceService,
              private messageService: MessageService , public ref: DynamicDialogRef, public dialogService: DialogService) {

    this.es = calendarioIdioma;

    this.updateDataForm = new FormGroup({
      'id': new FormControl(),
      'mat_matricula_psicologo_nacional': new FormControl('0'),
      'mat_matricula_psicologo': new FormControl(''),
      'mat_apellido': new FormControl(''),
      'mat_nombre': new FormControl(''),
      'mat_sexo': new FormControl('F'),
      'mat_localidad': new FormControl(''),
      'mat_domicilio_particular': new FormControl(''),
      'mat_domicilio_laboral': new FormControl(''),
      'mat_tel_particular': new FormControl('0'),     // debe concatenarsecon movimiento tipo 'movimiento_tipo': new FormControl(),
      'mat_tel_laboral': new FormControl('0'),
      'mat_lugar_laboral': new FormControl(''),
      'mat_email': new FormControl('sin_correo@corre.com'),
      'mat_tipo_dni': new FormControl('DNI'),
      'mat_dni': new FormControl('0'),
      'mat_num_cuenta': new FormControl('0'),
      'mat_banco_nombre': new FormControl('BANCO SANTANDER'),
      'mat_sucursal': new FormControl('0'),
      'mat_fecha_nacimiento': new FormControl(new Date()),
      'mat_fecha_egreso': new FormControl(new Date()),
      'mat_fecha_matricula': new FormControl(new Date()),
      'mat_fecha_pasivo': new FormControl(new Date('2099-12-31')),
      'mat_estado_matricula': new FormControl('A'),
      'mat_especialidad': new FormControl(''),
      'mat_orientacion': new FormControl(''),
      'mat_abordaje': new FormControl(''),
      'mat_excento': new FormControl('N'),
      'mat_cuit': new FormControl(''),
      'mat_ning_bto': new FormControl(''),
      'mat_banco': new FormControl('0'),
      'mat_cbu': new FormControl(''),
      'mat_nro_folio': new FormControl(''),
      'mat_nro_acta': new FormControl(''),
      'mat_fallecido': new FormControl('N'),
      'mat_historial': new FormControl(''),
      'nro_afiliado': new FormControl('0')

    });



    console.log(this.config.data);
    if (this.config.data) {
    this.esEditar = true;
    let _fecha: Date;
    let dateFix;
    this.updateDataForm.patchValue(this.config.data);
     _fecha = new Date(this.config.data.mat_fecha_nacimiento);
     dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
    this.config.data.mat_fecha_nacimiento = dateFix;

    _fecha = new Date(this.config.data.mat_fecha_egreso);
    dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
   this.config.data.mat_fecha_egreso = dateFix;

   _fecha = new Date(this.config.data.mat_fecha_matricula);
   dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
  this.config.data.mat_fecha_matricula = dateFix;

  _fecha = new Date(this.config.data.mat_fecha_pasivo);
  dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
 this.config.data.mat_fecha_pasivo = dateFix;

    this.updateDataForm.patchValue({mat_fecha_nacimiento: new Date(this.config.data.mat_fecha_nacimiento)});
    this.updateDataForm.patchValue({mat_fecha_egreso: new Date(this.config.data.mat_fecha_egreso)});
    this.updateDataForm.patchValue({mat_fecha_matricula: new Date(this.config.data.mat_fecha_matricula)});
    this.updateDataForm.patchValue({mat_fecha_pasivo: new Date(this.config.data.mat_fecha_pasivo)});
    console.log(this.updateDataForm.value);

  }
   }

  ngOnInit() {
  }

  actualizarDatos() {

    console.log(this.updateDataForm.value);
    if (this.esEditar) {
      try {
        this.matriculaService.putMatricula(this.updateDataForm.value, this.config.data.id)
        .subscribe(resp => {
          this.alertServiceService.throwAlert('success','Se modificó el registro con éxito', '', '');
          this.ref.close(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
    }
    } else {
      try {
        this.matriculaService.setMatricula(this.updateDataForm.value)
        .subscribe(resp => {
          this.alertServiceService.throwAlert('success','Se creó el registro con éxito', '', '');
          this.ref.close(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
    }
    }

}



}
