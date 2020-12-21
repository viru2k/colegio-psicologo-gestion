import { LiquidacionService } from './../../../../services/liquidacion.service';
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
  selector: 'app-popup-liquidacion-generada-detalle',
  templateUrl: './popup-liquidacion-generada-detalle.component.html',
  styleUrls: ['./popup-liquidacion-generada-detalle.component.scss']
})
export class PopupLiquidacionGeneradaDetalleComponent implements OnInit {


  cols: any[];
  colsOrden: any[];
  es: any;
  display: boolean;
  observacion: string;
  // LOADING
  DateForm: FormGroup;
  DateForm1: FormGroup;
  loading = false;
  elemento: any[] = null;
  elementoOrden: any[] = null;
  selecteditems: any[] = [];
  selecteditemsOrden: any[] = [];
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
  totalOrden = 0;
  cantidadOrden = 0;
  selectedPago: any;

  constructor(private cobroService: CobroService , private liquidacionService: LiquidacionService,  private messageService: MessageService,
              public dialogService: DialogService,  private route: ActivatedRoute,
              private alertServiceService: AlertServiceService, public config: DynamicDialogConfig,
              private excelService: ExcelService,    private router: Router, private filter: Filter ) {


      this.pago = [
        {name: 'Contado', code: 'C'},
        {name: 'Tarjeta credito', code: 'T'},
        {name: 'Tarjeta debito', code: 'D'},
        {name: 'Transferencia', code: 'B'}
    ];


      this.colsOrden = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'os_nombre', header: 'Obra social', width: '20%' },
        {field: 'os_sesion', header: 'Sesión', width: '20%' },
        {field: 'os_sesion_codigo', header: 'Código', width: '12%' },
        {field: 'os_precio_sesion', header: 'Valor', width: '12%' },
        {field: 'os_cantidad', header: 'Cant.', width: '12%' },
        {field: 'os_precio_total', header: 'Total', width: '12%' },
        {field: 'pac_nombre', header: 'Paciente', width: '18%' },
        {field: 'pac_dni', header: 'Dni', width: '16%' },

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
      this.getDeudaByMatriculaAndEstado(this.config.data.mat_matricula,'P', this.config.data.id_liquidacion_detalle);
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
        this.getDeudaByMatriculaAndEstado(this.config.data.mat_matricula,'P', this.config.data.id_liquidacion_detalle);
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







getOrdenByMatriculaAndLiquidacion(mat_matricula_psicologo, id_liquidacion: string) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;

  console.log(userData['id']);

  try {
      this.liquidacionService.getOrdenByMatriculaAndLiquidacion(mat_matricula_psicologo, id_liquidacion)
       .subscribe(resp => {

      if (resp[0]) {
        this.elementoOrden = resp;
        console.log(resp);
        this.sumarValoresOrden(resp);
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
          this.getOrdenByMatriculaAndLiquidacion(mat_matricula_psicologo, this.config.data.id_liquidacion_generada);
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




sumarValoresOrden(vals: any) {
  // SUMO LO FILTRADO
  console.log(vals);
  let _total_seleccionado = 0
  let i: number;
  for (i = 0; i < vals.length; i++) {
   this.totalOrden =  this.totalOrden+ Number(vals[i]['os_precio_total']);
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





