import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { calendarioIdioma } from './../../../../../config/config';
import { CobroService } from '../../../../../services/cobro.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-popup-concepto-editar',
  templateUrl: './popup-concepto-editar.component.html',
  styleUrls: ['./popup-concepto-editar.component.scss']
})
export class PopupConceptoEditarComponent implements OnInit {

  es: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  selectedCategory: any = null;
  updateDataForm: FormGroup;
  elementoConcepto: any[] = [];

  constructor(public config: DynamicDialogConfig,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef, private cobroService: CobroService) {

      this.es = calendarioIdioma;
      this.updateDataForm = new FormGroup({
      'id_concepto': new FormControl(''),
      'id_liquidacion_detalle': new FormControl(''),
      'id_pago_historico': new FormControl(''),
      'id_usuario': new FormControl(''),
      'mat_concepto': new FormControl(''),
      'mat_descripcion': new FormControl(''),
      'mat_estado': new FormControl('A'),
      'mat_fecha_pago': new FormControl(new Date()),
      'mat_fecha_vencimiento': new FormControl(new Date()),
      'mat_id_plan': new FormControl('0'),
      'mat_interes': new FormControl('1'),
      'mat_matricula': new FormControl('0'),
      'mat_monto': new FormControl('0'),
      'mat_monto_final': new FormControl('0'),
      'mat_nombreyapellido': new FormControl(''),
      'mat_num_cuota': new FormControl('1'),
      'mat_numero_comprobante': new FormControl('0'),
      'mat_tipo_pago': new FormControl('C'),
      'nombreyapellido': new FormControl(''),
  });
     }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);

    let _fecha: Date = new Date(this.config.data.mat_fecha_pago);
    let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
    console.log((new Date()).getFullYear() - (new Date(dateFix)).getFullYear());
    console.log(dateFix);
    this.config.data.mat_fecha_pago = dateFix;

    _fecha = new Date(this.config.data.mat_fecha_vencimiento);
    dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
    console.log((new Date()).getFullYear() - (new Date(dateFix)).getFullYear());
    console.log(dateFix);
    this.config.data.mat_fecha_vencimiento = dateFix;

    this.updateDataForm.patchValue({mat_fecha_pago: new Date(this.config.data.mat_fecha_pago)});
    this.updateDataForm.patchValue({mat_fecha_vencimiento: new Date(this.config.data.mat_fecha_vencimiento)});
    this.updateDataForm.patchValue({id_liquidacion_detalle: this.config.data.id_liquidacion_detalle});
    this.updateDataForm.patchValue({mat_concepto: this.config.data.mat_concepto});
    this.updateDataForm.patchValue({mat_descripcion: this.config.data.mat_descripcion});
    this.updateDataForm.patchValue({mat_matricula: this.config.data.mat_matricula});
    this.updateDataForm.patchValue({mat_nombreyapellido: this.config.data.mat_nombreyapellido});
    this.updateDataForm.patchValue({mat_estado: this.config.data.mat_estado});
    this.updateDataForm.patchValue({mat_id_plan: this.config.data.mat_id_plan});
    this.updateDataForm.patchValue({mat_num_cuota: this.config.data.mat_num_cuota});
    this.updateDataForm.patchValue({mat_interes: this.config.data.mat_interes});
    this.updateDataForm.patchValue({mat_monto: this.config.data.mat_monto});
    this.updateDataForm.patchValue({mat_monto_final: this.config.data.mat_monto_final});
    this.updateDataForm.patchValue({mat_tipo_pago: this.config.data.mat_tipo_pago});
    this.updateDataForm.patchValue({mat_numero_comprobante: this.config.data.mat_numero_comprobante});
    this.updateDataForm.patchValue({id_concepto: this.config.data.id_concepto});

    this.loadConcepto();
  }


  calcularTotal() {
    this.updateDataForm.patchValue({mat_monto_final: (this.updateDataForm.value.mat_interes * this.updateDataForm.value.mat_monto )});
  }


  loadConcepto() {
    this.loading = true;
  try {
      this.cobroService.getConcepto()
      .subscribe(resp => {

      if (resp[0]) {
        console.log(resp);
        this.elementoConcepto = resp;
        this.updateDataForm.get('mat_concepto').setValue(this.elementoConcepto.find(elem => elem.mat_concepto === this.config.data.mat_concepto));
          }
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


  changeElementoConcepto(event) {
    console.log(event.value);
  //  this.updateDataForm.patchValue({ mat_concepto: event.value.mat_concepto});
    this.updateDataForm.patchValue({ id_concepto: event.value.id_concepto});
    this.updateDataForm.patchValue({ mat_monto: event.value.mat_monto});
    this.updateDataForm.patchValue({ mat_interes: event.value.mat_interes});
    this.updateDataForm.patchValue({mat_monto_final: (event.value.mat_interes * event.value.mat_monto )});

  }

  actualizarDatos() {

    console.log(this.updateDataForm.value);
    this.updateDataForm.patchValue({mat_fecha_pago :  formatDate(this.updateDataForm.value.mat_fecha_pago , 'dd/MM/yyyy', 'en')});
    this.updateDataForm.patchValue({mat_fecha_vencimiento :  formatDate(this.updateDataForm.value.mat_fecha_vencimiento , 'dd/MM/yyyy', 'en')});
    try {
      this.cobroService.putDeuda(this.updateDataForm.value, this.config.data.id_pago_historico)
      .subscribe(resp => {
        this.alertServiceService.throwAlert('success', 'Se modificó el registro con éxito', '', '');
        console.log(resp);
        this.ref.close(this.updateDataForm.value);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          // tslint:disable-next-line: max-line-length
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
       });
  } catch (error) {
  this.alertServiceService.throwAlert('error', 'Error al cargar los registros', error, error.status);
  }
  }

}
