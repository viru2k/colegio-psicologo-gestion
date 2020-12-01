import { Component, OnInit } from '@angular/core';
import { calendarioIdioma } from './../../../../../config/config';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { CobroService } from './../../../../../services/cobro.service';
import { DynamicDialogConfig, DialogService, DynamicDialogRef } from 'primeng/api';
import { formatDate } from '@angular/common';
import { Concepto } from '../../../../../models/concepto.model';
import { PopupConceptoEditarComponent } from './../popup-concepto-editar/popup-concepto-editar.component';
import { Filter } from './../../../../../shared/filter';
import { PlanPago } from './../../../../../models/plan-pago.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-concepto-plan-pago',
  templateUrl: './popup-concepto-plan-pago.component.html',
  styleUrls: ['./popup-concepto-plan-pago.component.scss']
})
export class PopupConceptoPlanPagoComponent implements OnInit {

  _mat_concepto: any[] = [];
  _mat_num_cuota: any[] = [];
  _mat_estado: any[] = [];
  _nombreyapellido: any[] = [];
  elementos: any[] = [];
  conceptoSeleccionado:any = [];
  conceptos: Concepto[] = [];
  conceptosPlanPago: Concepto[] = [];
  fechaPlan: Date;
  _fechaPlan: string;
  cols: any[];
  es: any;
  display: boolean;
  loading = false;
  elemento: any[] = null;
  selecteditems: any[] = [];
  userData: any;
  cuotas = 1;
  interes = 1;
  valor = 0;
  valorTotal = 0;
  concepto = '';
  total = 0;
  planNumero = 0;


  constructor(private config: DynamicDialogConfig,
              private cobroService: CobroService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              public ref: DynamicDialogRef,
              private filter: Filter ) {

                this.cols = [
                  {field: 'boton', header: '' , width: '6%'},
                  {field: 'mat_matricula', header: 'Matrícula', width: '8%' },
                  {field: 'mat_nombreyapellido', header: 'Psicólogo', width: '20%' },
                  {field: 'mat_concepto', header: 'Concepto', width: '20%' },
                  {field: 'mat_descripcion', header: 'Descripción', width: '25%' },
                  {field: 'mat_monto', header: 'Valor', width: '12%' },
                  {field: 'mat_monto_final', header: 'Importe', width: '12%' },
                  {field: 'mat_fecha_pago', header: 'F. Pago', width: '12%' },
                  {field: 'mat_fecha_vencimiento', header: 'F. Venc', width: '12%' },
                  {field: 'mat_num_cuota', header: 'Cuota', width: '8%' },
                  {field: 'mat_id_plan', header: 'Plan', width: '8%' },
                  {field: 'mat_estado', header: 'Estado' , width: '8%'},
                  {field: 'nombreyapellido', header: 'Usuario' , width: '14%'},
                  ];
               }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    console.log(this.config.data);
    this.elementos = this.config.data;
    this.fechaPlan = new Date();
    this.sumarTotal();
    this.realizarFiltroBusqueda(this.elementos);
    this.loadConcepto();

  }



  actualizarFechaPlan(event) {
    console.log(event);
    this.fechaPlan = event;
    console.log(new Date(this.fechaPlan));
  }

  loadConcepto() {
    this.loading = true;
    try {
      this.cobroService.getUltimoPlanPago()
      .subscribe(resp => {
        this.planNumero = resp[0].ultimo + 1;

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

  sumarTotal() {
    let i = 0;
    for (i = 0; i < this.config.data.length; i++) {
      console.log(this.config.data[i]);
      this.total = this.total + Number(this.config.data[i].mat_monto_final);
    }
  }

  calcularDeuda() {
      this.valorTotal = (this.total * this.interes) / this.cuotas;
  }



  editarRegistro(event) {

    const data: any = event;

    const ref = this.dialogService.open(PopupConceptoEditarComponent, {
    data,
     header: 'Editar concepto',
     width: '98%',
     height: '95%'
    });

    ref.onClose.subscribe((PopupConceptoEditarComponent: any) => {

      this.ref.close();
    });

    }



  generarPlanPago() {
    let planPago: PlanPago;
    let _concepto :Concepto = null;
    this._fechaPlan = formatDate(this.fechaPlan, 'yyyy-MM-dd', 'en');
    let newDate = null;
    if (this.cuotas > 0) {
      this.calcularDeuda();
      for (let i = 0; i < this.cuotas; i++) {
        let _fecha_vencimiento = this.filter.getFechaAfterMonth(i + 1);
        console.log(_fecha_vencimiento);

        _concepto = new Concepto('0', '11',
        this.userData.id, 'PLAN DE PAGO',  'PLAN DE PAGO',
        'A', '2099-12-31', _fecha_vencimiento, String(this.planNumero), this.interes,
        this.config.data[0].mat_matricula, this.valorTotal, this.valorTotal,
        this.config.data[0].mat_matricula,  i + 1, '0', 'C', this.userData.id );

        this.conceptosPlanPago.push(_concepto);

        this.config.data.forEach(element => {
          element.mat_id_plan = String(this.planNumero);
          element.mat_fecha_pago = this._fechaPlan;
          element.id_usuario = this.userData.id;
          element.mat_tipo_pago = this.config.data.forma_pago;
        });
      }

      console.log(this.conceptosPlanPago);
      planPago = new PlanPago(this.conceptosPlanPago, this.config.data);

      console.log(planPago);
      this.guardarPlan(planPago);
    }

  }


  guardarPlan(plan: PlanPago) {
    this.loading = true;
    try {
      this.cobroService.setPlanPagoMatricula(plan)
      .subscribe(resp => {

      if (resp[0]) {
        this.elemento = resp;
        swal({
          title: 'PLAN GENERADO' ,
          text: 'El plan número ' + this.planNumero + 'se generó correctamente',
          type: 'success',
          showConfirmButton: false,
          timer: 2000

        });
        this.ref.close(resp);
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


/** ACCIONES */

colorRow(estado: string){

  if(estado == 'INGRESO') {
      return {'es-ingreso'  :'null' };
  }

  if(estado == 'EGRESO') {
      return {'es-egreso'  :'null' };
  }
}


realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._mat_concepto = [];
  this._mat_num_cuota = [];
  this._mat_estado = [];
  this._nombreyapellido = [];

  resp.forEach(element => {
    this._mat_concepto.push(element['mat_concepto']);
    this._mat_num_cuota.push(element['mat_num_cuota']);
    this._mat_estado.push(element['mat_estado']);
    this._nombreyapellido.push(element['nombreyapellido']);
    /** SUMO LO FILTRADO */

  });

  // ELIMINO DUPLICADOS
  this._mat_concepto = this.filter.filterArray(this._mat_concepto);
  this._mat_num_cuota = this.filter.filterArray(this._mat_num_cuota);
  this._mat_estado = this.filter.filterArray(this._mat_estado);
  this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);



}


colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
