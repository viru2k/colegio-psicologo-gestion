import { PopupConceptoEditarComponent } from './../../../matricula/matricula-cobro/popups/popup-concepto-editar/popup-concepto-editar.component';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { CobroService } from './../../../../services/cobro.service';
import { PopupConceptoAgregarComponent } from './../../../matricula/matricula-cobro/popups/popup-concepto-agregar/popup-concepto-agregar.component';
import { PopupMovimientoComponent } from './../../../movimiento-caja/popup-movimiento/popup-movimiento.component';
import { calendarioIdioma } from './../../../../config/config';
import { Filter } from './../../../../shared/filter';
import { ExcelService } from './../../../../services/excel.service';


import { DialogService, MessageService, DynamicDialogConfig } from 'primeng/api';
import { formatDate, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { ActivatedRoute, Route, Router } from '@angular/router';







@Component({
  selector: 'app-popup-matricula-detalle-liquidacion',
  templateUrl: './popup-matricula-detalle-liquidacion.component.html',
  styleUrls: ['./popup-matricula-detalle-liquidacion.component.scss']
})
export class PopupMatriculaDetalleLiquidacionComponent implements OnInit {

  cols: any[];
  es: any;
  display: boolean;
  observacion: string;
  // LOADING
  DateForm: FormGroup;
  DateForm1: FormGroup;
  loading = false;
  elemento: any[] = null;
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  columns: any;
  userData: any;
  fecha: Date;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;

  total_ingreso = 0;
  total_egreso = 0;
  saldo = 0;
  matricula: string;
  estado: string;
  psicologo: any = null;
  _mat_concepto: any[] = [];
  _mat_num_cuota: any[] = [];
  _mat_estado: any[] = [];
  _nombreyapellido: any[] = [];
  _mat_tipo_pago: any[] = [];
  pago: any[];
  total = 0;
  total_seleccionado = 0;
  selectedPago: any;

  constructor(private cobroService: CobroService ,  private messageService: MessageService,
              public dialogService: DialogService,  private route: ActivatedRoute,
              private alertServiceService: AlertServiceService, public config: DynamicDialogConfig,
              private excelService: ExcelService,    private router: Router, private filter: Filter ) {


      this.pago = [
        {name: 'Contado', code: 'C'},
        {name: 'Tarjeta credito', code: 'T'},
        {name: 'Tarjeta debito', code: 'D'},
        {name: 'Transferencia', code: 'B'}
    ];


      this.cols = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'mat_matricula', header: 'Mat.', width: '8%' },
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
        {field: 'mat_tipo_pago', header: 'Tipo' , width: '8%'},
        {field: 'id_liquidacion_detalle', header: 'N°', width: '8%' },
        {field: 'nombreyapellido', header: 'Usuario' , width: '14%'},
        ];

      this.columns = [
          {title: 'Matrícula', dataKey: 'mat_matricula'},
          {title: 'Psicólogo', dataKey: 'mat_nombreyapellido'},
          {title: 'Concepto', dataKey: 'mat_concepto'},
          {title: 'Descripción', dataKey: 'mat_descripcion'},
          {title: 'Valor', dataKey: 'mat_monto'},
          {title: 'Importe', dataKey: 'mat_monto_final'},
          {title: 'Vencimiento', dataKey: 'mat_fecha_vencimiento'},
          {title: 'Cuota', dataKey: 'mat_num_cuota'},
          {title: 'Plan', dataKey: 'mat_id_plan'},
          {title: 'Estado', dataKey: 'mat_estado'},
          {title: 'Punto', dataKey: 'id_usuario'}

      ];
      }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    console.log(this.config.data);
    this.getDeudaByMatriculaAndEstado(this.config.data.mat_matricula,'P', this.config.data.id_liquidacion_detalle);
  }


  changeElementoPago(event) {
    console.log(event.value);
    this.selectedPago = event.value;

  }

exportarExcel() {
let result = this.elementosFiltrados as any;
if (this.selecteditems.length > 0) {

}else{
  swal({
    title: 'TURNOS NO SELECCIONADOS' ,
    text: 'Debe seleccionar al menos un turno',
    type: 'warning',
    showConfirmButton: false,
    timer: 4000

  })
}

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupMovimientoComponent, {
  data,
   header: 'Agregar ingreso',
   width: '98%',
   height: '95%'
  });

  ref.onClose.subscribe((PopupMovimientoComponent: any) => {

    if (PopupMovimientoComponent) {
      //this.loadMovimientoRegistro();
    }
  });

}


public exportarExcelDetallado(){
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
   seleccionados['mat_matricula'] = element.mat_matricula;
   seleccionados['mat_nombreyapellido'] = element.mat_nombreyapellido;
   seleccionados['mat_num_cuota'] = element.mat_num_cuota;
   seleccionados['mat_fecha_pago'] =   formatDate(element['mat_fecha_pago'], 'dd/MM/yyyy', 'es-Ar');  ;
   seleccionados['mat_fecha_vencimiento'] =   formatDate(element['mat_fecha_vencimiento'], 'dd/MM/yyyy', 'es-Ar');  ;
   seleccionados['mat_concepto'] = element.mat_concepto ;
   seleccionados['mat_descripcion'] = element.mat_descripcion;
   seleccionados['mat_id_plan'] = element.mat_id_plan;
   seleccionados['mat_monto'] = element.mat_monto;
   seleccionados['id_pago_historico'] = element.id_pago_historico;
   seleccionados['mat_estado'] = element.mat_estado;
   seleccionados['id_usuario'] = element.id_usuario;


   // exportar.push(seleccionados);
   exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
   seleccionados = [];
   i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'listado_pagos'+fecha_impresion);
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

    if (PopupConceptoEditarComponent) {
      this.getDeudaByMatricula(this.psicologo.mat_matricula_psicologo);
      //this.loadMovimientoRegistro();
    }
  });

  }

  filtered(event) {

    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;
    this.sumarValoresSeleccionados(this.elementosFiltrados) ;
}

agregarConcepto() {

  if (this.psicologo) {
    let data:any = this.psicologo;
    const ref = this.dialogService.open(PopupConceptoAgregarComponent, {
    data,
     header: 'Agregar concepto',
     width: '98%',
     height: '100%'
    });

    ref.onClose.subscribe((PopupConceptoAgregarComponent: any) => {
       if (PopupConceptoAgregarComponent) {
        console.log(PopupConceptoAgregarComponent);
        this.getDeudaByMatricula(this.psicologo.mat_matricula_psicologo);
       }
    });
  } else {
    swal({
      title: 'PSICOLOGO  NO SELECCIONADO' ,
      text: 'Debe buscar buscar al menos un psicologo',
      type: 'warning',
      showConfirmButton: false,
      timer: 4000

    })
  }


}






getDeudaByMatricula(mat_matricula_psicologo) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;
  this.total = 0;
  this.total_seleccionado = 0;
  console.log(userData['id']);

  try {
      this.cobroService.getDeudaByMatricula(mat_matricula_psicologo)
      .subscribe(resp => {

      if (resp[0]) {
        let i = 0;
        for (i = 0; i < resp.length; i++) {

          if (this.filter.monthdiff(resp[i]['mat_fecha_vencimiento']) >= 3) {
            resp[i]['mat_monto_final'] = Number(resp[i]['mat_monto']) * Number(resp[i]['mat_interes']);
            this.total =  this.total + Number(resp[i]['mat_monto']) * Number(resp[i]['mat_interes']);
          } else {
            this.total =  this.total + Number(resp[i]['mat_monto']);
            resp[i]['mat_monto_final'] = Number(resp[i]['mat_monto']);
          }

          }
        this.realizarFiltroBusqueda(resp);

        this.elemento = resp;
        console.log(resp);
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


getDeudaByMatriculaAndEstado(mat_matricula_psicologo, estado: string, id_liquidacion_detalle: string) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;

  this.total = 0;
  this.total_seleccionado = 0;
  console.log(userData['id']);

  try {
      this.cobroService.getDeudaByMatriculaAndEstadoByIdLiquidacionDetalle(mat_matricula_psicologo, estado, id_liquidacion_detalle)
      .subscribe(resp => {

      if (resp[0]) {
        let i = 0;
        for (i = 0; i < resp.length; i++) {
      //    console.log(this.filter.monthdiff(resp[i]['mat_fecha_vencimiento']));
          if (this.filter.monthdiff(resp[i]['mat_fecha_vencimiento']) >= 3) {
            resp[i]['mat_monto_final'] = Number(resp[i]['mat_monto']) * Number(resp[i]['mat_interes']);
            this.total =  this.total + Number(resp[i]['mat_monto']) * Number(resp[i]['mat_interes']);
          } else {
            this.total =  this.total + Number(resp[i]['mat_monto']);
            resp[i]['mat_monto_final'] = Number(resp[i]['mat_monto']);
          }
          }
        this.realizarFiltroBusqueda(resp);

        this.elemento = resp;
        console.log(resp);
        }
      this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, '');
       });
  } catch (error) {
  this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error,'');
  }
}





sumarValoresSeleccionados(vals: any) {
        // SUMO LO FILTRADO
        console.log(vals);
        this.total_seleccionado = 0;
        let i: number;
        for (i = 0; i < vals.length; i++) {
         this.total_seleccionado =  this.total_seleccionado+ Number(vals[i]['mat_monto_final']);
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
  this._mat_tipo_pago = [];
  resp.forEach(element => {
    this._mat_concepto.push(element['mat_concepto']);
    this._mat_num_cuota.push(element['mat_num_cuota']);
    this._mat_estado.push(element['mat_estado']);
    this._nombreyapellido.push(element['nombreyapellido']);
    this._mat_tipo_pago.push(element['mat_tipo_pago']);
    /** SUMO LO FILTRADO */

  });

  // ELIMINO DUPLICADOS
  this._mat_concepto = this.filter.filterArray(this._mat_concepto);
  this._mat_num_cuota = this.filter.filterArray(this._mat_num_cuota);
  this._mat_estado = this.filter.filterArray(this._mat_estado);
  this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);
  this._mat_tipo_pago = this.filter.filterArray(this._mat_tipo_pago);



}


colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}





