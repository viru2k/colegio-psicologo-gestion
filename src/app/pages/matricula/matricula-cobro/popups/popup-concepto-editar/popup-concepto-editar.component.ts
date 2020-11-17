import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { calendarioIdioma } from './../../../../../config/config';
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

  constructor(public config: DynamicDialogConfig,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

      this.es = calendarioIdioma;
      this.updateDataForm = new FormGroup({
      'id_concepto': new FormControl(''),
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
    this.updateDataForm.patchValue({mat_fecha_pago: new Date(this.config.data.mat_fecha_pago)});
    this.updateDataForm.patchValue({mat_fecha_vencimiento: new Date(this.config.data.mat_fecha_vencimiento)});
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
  }


  calcularTotal() {
    this.updateDataForm.patchValue({mat_monto_final: (this.updateDataForm.value.mat_interes * this.updateDataForm.value.mat_monto )});
  }

}
