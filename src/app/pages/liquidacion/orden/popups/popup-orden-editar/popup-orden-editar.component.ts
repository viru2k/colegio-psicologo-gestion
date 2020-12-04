import { LiquidacionService } from './../../../../../services/liquidacion.service';
import { PopupFindPacienteComponent } from './../../../../../shared/popups/popup-find-paciente/popup-find-paciente.component';
import { DialogService } from 'primeng/components/common/api';
import { PopupFindMatriculaComponent } from './../../../../../shared/popups/popup-find-matricula/popup-find-matricula.component';
import { formatDate } from '@angular/common';
import { calendarioIdioma } from 'src/app/config/config';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PopupFindConvenioComponent } from 'src/app/shared/popups/popup-find-convenio/popup-find-convenio.component';
import swal from 'sweetalert2';
@Component({
  selector: 'app-popup-orden-editar',
  templateUrl: './popup-orden-editar.component.html',
  styleUrls: ['./popup-orden-editar.component.scss']
})
export class PopupOrdenEditarComponent implements OnInit {

  es: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  selectedCategory: any = null;
  updateDataForm: FormGroup;

  constructor(public config: DynamicDialogConfig,
              private alertServiceService: AlertServiceService,
              public ref: DynamicDialogRef,
              private messageService: MessageService,
              public dialogService: DialogService,
              public liquidacionService: LiquidacionService) {


    this.updateDataForm = new FormGroup({
      'id_os_liq_orden': new FormControl(''),
      'mat_matricula': new FormControl(''),
      'mat_apellido_nombre': new FormControl(''),
      'id_obra_social': new FormControl(''),
      'id_sesion': new FormControl('1'),
      'id_paciente': new FormControl('99'),
      'pac_nombre': new FormControl(''),
      'pac_dni': new FormControl(''),
      'os_fecha': new FormControl(''),
      'os_cantidad': new FormControl('1'),
      'os_precio_sesion': new FormControl('0'),
      'os_precio_total': new FormControl('0'),
      'os_estado_liquidacion': new FormControl('PEN'),
      'os_liq_numero': new FormControl('0'),
      'os_nombre': new FormControl(''),
      'os_sesion_codigo': new FormControl(''),
      'os_sesion': new FormControl(''),
  });
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.es_nuevo = false;

      let _fecha: Date = new Date(this.config.data.os_fecha);
      let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
      console.log((new Date()).getFullYear() - (new Date(dateFix)).getFullYear());
      console.log(dateFix);
      this.config.data.os_fecha = dateFix;

      this.updateDataForm.patchValue( this.config.data);
      this.updateDataForm.patchValue({id_os_liq_orden: this.config.data.id_os_liq_orden});
      this.updateDataForm.patchValue({mat_matricula: this.config.data.mat_matricula});
      this.updateDataForm.patchValue({mat_apellido_nombre: this.config.data.mat_apellido_nombre});
      this.updateDataForm.patchValue({id_sesion: this.config.data.id_sesion});
      this.updateDataForm.patchValue({id_paciente: this.config.data.id_paciente});
      this.updateDataForm.patchValue({pac_nombre: this.config.data.pac_nombre});
      this.updateDataForm.patchValue({os_fecha: new Date(this.config.data.os_fecha)});
      this.updateDataForm.patchValue({os_cantidad: this.config.data.os_cantidad});
      this.updateDataForm.patchValue({os_precio_sesion: this.config.data.os_precio_sesion});
      this.updateDataForm.patchValue({os_precio_total: this.config.data.os_precio_total});
      this.updateDataForm.patchValue({os_estado_liquidacion: this.config.data.os_estado_liquidacion});
      this.updateDataForm.patchValue({os_liq_numero: this.config.data.os_liq_numero});

      console.log(this.updateDataForm.value);
     // this.updateDataForm.patchValue({cuenta_nombre: this.config.data.cuenta_nombre});
     // this.updateDataForm.patchValue({movimiento_tipo: this.config.data.movimiento_tipo});
      //this.uda
      //this.selectedCategory = this.categories[1];
    } else {
      this.es_nuevo = true;
      console.log('es nuevo');
    }
  }

  calcularTotal() {

    this.updateDataForm.patchValue({os_precio_total: Number(this.updateDataForm.value.os_cantidad) * Number(this.updateDataForm.value.os_precio_sesion) });
  }

  actualizarPrecioSesion() {
    this.updateDataForm.patchValue({os_precio_sesion: this.updateDataForm.value.os_precio_sesion });
    this.updateDataForm.patchValue({os_precio_total: Number(this.updateDataForm.value.os_cantidad) * Number(this.updateDataForm.value.os_precio_sesion) });
  }




  buscarMatricula() {

    const ref = this.dialogService.open(PopupFindMatriculaComponent, {

         header: 'Editar psicologo',
         width: '98%',
         height: '98%'
        });

    ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
           if (PopupFindMatriculaComponent) {
            console.log(PopupFindMatriculaComponent);
            this.updateDataForm.patchValue({mat_matricula: PopupFindMatriculaComponent.mat_matricula_psicologo});
            this.updateDataForm.patchValue({mat_apellido_nombre: PopupFindMatriculaComponent.mat_apellido + ' ' +PopupFindMatriculaComponent.mat_nombre});
              console.log(this.updateDataForm.value);
           // this.buscarEntreFechas();
           }
        });

  }

  buscarPaciente() {

    const ref = this.dialogService.open(PopupFindPacienteComponent, {

         header: 'Editar paciente',
         width: '98%',
         height: '98%'
        });

    ref.onClose.subscribe((PopupFindPacienteComponent: any) => {
           if (PopupFindPacienteComponent) {
            console.log(PopupFindPacienteComponent);
            console.log(PopupFindPacienteComponent.pac_nombre);
            this.updateDataForm.patchValue({id_paciente: PopupFindPacienteComponent.id_paciente});
            this.updateDataForm.patchValue({pac_nombre: PopupFindPacienteComponent.pac_nombre});
            this.updateDataForm.patchValue({pac_dni: PopupFindPacienteComponent.pac_dni});
              console.log(this.updateDataForm.value);

           }
        });

  }

  buscarOrden() {

    const ref = this.dialogService.open(PopupFindConvenioComponent, {

         header: 'Editar orden',
         width: '98%',
         height: '98%'
        });

    ref.onClose.subscribe((PopupFindConvenioComponent: any) => {
           if (PopupFindConvenioComponent) {
            console.log(PopupFindConvenioComponent);

            this.updateDataForm.patchValue({id_obra_social: PopupFindConvenioComponent.id});
            this.updateDataForm.patchValue({id_sesion: PopupFindConvenioComponent.id_sesion});
            this.updateDataForm.patchValue({os_nombre: PopupFindConvenioComponent.os_nombre});
            this.updateDataForm.patchValue({os_sesion: PopupFindConvenioComponent.os_sesion});
            this.updateDataForm.patchValue({os_sesion_codigo: PopupFindConvenioComponent.os_sesion_codigo});
            this.updateDataForm.patchValue({id_precio: PopupFindConvenioComponent.id_precio});
            this.updateDataForm.patchValue({os_precio_sesion: PopupFindConvenioComponent.id_precio });
            this.updateDataForm.patchValue({os_precio_total: Number(this.updateDataForm.value.os_cantidad) * Number(PopupFindConvenioComponent.id_precio) });
             // console.log(this.updateDataForm.value);
           // this.buscarEntreFechas();
           }
        });

  }


  guardarDatos(){
    const _os_fecha =   formatDate( this.updateDataForm.value.os_fecha, 'dd/MM/yyyy', 'en') ;
     //this.updateDataForm.patchValue({os_fecha: _os_fecha});
     let elemento = this.updateDataForm.value;
     elemento.os_fecha = _os_fecha;
    console.log(this.updateDataForm.value);

    try {
      this.loading = true;
      this.liquidacionService.putOrden(this.updateDataForm.value, this.updateDataForm.value.id_os_liq_orden )
      .subscribe(resp => {
        console.log(resp);
        swal({
          toast: false,
          type: 'success',
          text: 'Se modifico la orden ',
          title: 'ORDEN MODIFICADA',
          showConfirmButton: false,
          timer: 2000,
          onClose: () => {
            this.ref.close(this.updateDataForm.value);
          }
        });
        this.loading = false;

      },
      error => { // error path
        this.loading = false;
        console.log(error.message);
        console.log(error.status);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, '');
      });
    } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error, ' ');
    }
  }

}
