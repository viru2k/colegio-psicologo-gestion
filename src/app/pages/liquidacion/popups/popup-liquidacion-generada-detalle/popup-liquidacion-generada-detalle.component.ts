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
import { formatDate, DatePipe, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';




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
  elementosOS: any[] = [];
  selecteditems: any[] = [];
  selecteditemsOrden: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  columnsOrden: any;
  columnsMatricula: any;
  userData: any;
  hoy: Date;
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
              public dialogService: DialogService,  private route: ActivatedRoute, private cp: CurrencyPipe,
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

      this.columnsOrden = [
          {title: 'Orden', dataKey: 'os_nombre'},
          {title: 'Sesión', dataKey: 'os_sesion'},
          {title: 'Código', dataKey: 'os_sesion_codigo'},
          {title: 'valor', dataKey: 'id_precio'},
          {title: 'Cantidad', dataKey: 'os_cantidad'},
          {title: 'Total', dataKey: 'os_precio_total'},
      ];

      this.columnsMatricula = [
        {title: 'Concepto', dataKey: 'mat_concepto'},
        {title: 'Descripción', dataKey: 'mat_descripcion'},
        {title: 'Valor', dataKey: 'mat_monto'},
        {title: 'Importe', dataKey: 'mat_monto_final'},
        {title: 'Vencimiento', dataKey: 'mat_fecha_vencimiento'},
        {title: 'Cuota', dataKey: 'mat_num_cuota'},
        {title: 'Plan', dataKey: 'mat_id_plan'},
    ];
      }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.hoy = new Date();
    console.log(this.config.data);
    this.getDeudaByMatriculaAndEstado(this.config.data.mat_matricula,'P', this.config.data.id_liquidacion_detalle);
    this.getOrdenByMatriculaAndLiquidacion(this.config.data.mat_matricula, this.config.data.id_liquidacion_generada);

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
        this.getObrasSocialesByLiquidacion(id_liquidacion);
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
      if (Number(this.filter.monthDiffByDates(  new Date(resp[i]['mat_fecha_vencimiento']), this.hoy)) > 2) {
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




getObrasSocialesByLiquidacion(id_liquidacion) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;

  console.log(userData['id']);

  try {
      this.liquidacionService.getObrasSocialesByLiquidacion(id_liquidacion)
       .subscribe(resp => {
        console.log(resp);
        this.elementosOS = resp;
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


imprimirResumen(){
  let _obra_social = '';
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  if(!this.elemento){
    this.elemento = [];
  }
  for(let i= 0; i<this.elementosOS.length; i++){
    _obra_social = _obra_social + ' | ' + this.elementosOS[i].os_nombre + ' - ' + formatDate(this.elementosOS[i].os_fecha_desde , 'MM/yyyy', 'en');
  }
  //if (!this.selecteditems) {

    //let fecha = formatDate(this.fec, 'dd/MM/yyyy', 'en');
  var doc = new jsPDF();

  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  let img = new Image();
  img.src = './assets/images/user-default.png';
  doc.addImage(img, 'PNG', 5, 5, 18, 18, undefined, 'FAST');
  doc.setFontSize(10);
  doc.text('Colegio de psicólgos', 30, 10, null, null);
  doc.text('de san juan', 30, 13, null, null);
  doc.setFontSize(10);
  doc.text('Detalle de liquidación', pageWidth / 2, 10, null, null, 'center');
  doc.setFontSize(9);
  doc.text('Obras sociales a facturar :', pageWidth / 2, 28, null, null, 'center');
  doc.setFontSize(6);
  var splitTitle = doc.splitTextToSize(_obra_social, 180);
  doc.text(15, 32, splitTitle);
  doc.setLineWidth(0.4);

  doc.setFontSize(8);
  doc.text('Liquidación Nro : ' + this.config.data.id_liquidacion, pageWidth -60, 10, null, null);
  doc.text('Fecha de liq. : ' +  formatDate(this.config.data.os_fecha , 'dd/MM/yyyy', 'en'), pageWidth -60, 13, null, null);
  doc.text( 'Comprobante : ' +this.config.data.num_comprobante , pageWidth -60, 16, null, null);
  doc.text( 'Matricula : ' +this.config.data.mat_matricula , pageWidth -60, 19, null, null);
  doc.text( this.config.data.mat_apellidoynombre, pageWidth -60,22 , null, null);


 // ORDENES
  doc.setFontSize(9);
  doc.text('ORDENES', pageWidth / 2, 50, null, null, 'center');
  doc.setFontSize(8);
  doc.autoTable(this.columnsOrden, this.elementoOrden,
        {
          margin: {horizontal: 5, vertical: 54},
          bodyStyles: {valign: 'top'},
          styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
          columnStyles: {text: {cellWidth: 'auto'}}
        }
        );

  let currentY = doc.autoTable.previous.finalY;
  doc.text('BRUTO: ' + this.cp.transform(this.config.data.os_liq_bruto, '', 'symbol-narrow', '1.2-2')  , pageWidth -50, currentY + 10, null, null);

  doc.line(15, currentY + 14, pageWidth - 15, currentY + 14);
  doc.text('Ing. brutos: ' + this.cp.transform(this.config.data.os_ing_brutos, '', 'symbol-narrow', '1.2-2'),15 , currentY + 20, null, null);
  doc.text('Lote hogar: ' + this.cp.transform(this.config.data.os_lote_hogar, '', 'symbol-narrow', '1.2-2'), 65, currentY + 20, null, null);
  doc.text('Gastos adm.: ' + this.cp.transform(this.config.data.os_gasto_admin, '', 'symbol-narrow', '1.2-2'), 105, currentY + 20, null);
  doc.text('Matricula: ' + this.cp.transform(this.config.data.os_desc_matricula, '', 'symbol-narrow', '1.2-2'), 15, currentY + 24, null, null);
  doc.text('Fondo solidario: ' + this.cp.transform(this.config.data.os_desc_fondo_sol, '', 'symbol-narrow', '1.2-2'), 65, currentY + 24, null, null);
  doc.text('Otros descuentos: ' + this.cp.transform(this.config.data.os_descuentos, '', '', '1.2-2'), 105,currentY + 24, null, null);
  doc.line(15, currentY + 28, pageWidth - 15, currentY + 28);

// MATRICULA

doc.setFontSize(9);
  doc.text('DESCUENTOS REALIZADOS', pageWidth / 2, currentY + 34, null, null, 'center');
  doc.setFontSize(8);
  doc.autoTable(this.columnsMatricula, this.elemento,
        {
          margin: {horizontal: 5, vertical: currentY + 38},
          bodyStyles: {valign: 'top'},
          styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
          columnStyles: {text: {cellWidth: 'auto'}}
        }
        );


  let finalY = doc.autoTable.previous.finalY;
  doc.setLineWidth(0.4);

  doc.setFontSize(10);
  doc.text('NETO A COBRAR: ' + this.cp.transform(this.config.data.os_liq_neto, '', 'symbol-narrow', '1.2-2') , pageWidth -70, finalY+15, null, null);
  window.open(doc.output('bloburl'));


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


sumarValores(vals: any) {
  // SUMO LO FILTRADO
  console.log(vals);
  let _total_seleccionado = 0
  let i: number;
  for (i = 0; i < vals.length; i++) {
   this.total =  this.total+ Number(vals[i]['mat_monto']);
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





