

import { DialogService, MessageService } from 'primeng/api';
import { formatDate, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import {OverlayPanelModule, OverlayPanel} from 'primeng/overlaypanel';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PopupMovimientoComponent } from './../../movimiento-caja/popup-movimiento/popup-movimiento.component';
import { calendarioIdioma } from './../../../config/config';
import { ExcelService } from './../../../services/excel.service';
import { Filter } from './../../../shared/filter';
import { CobroService } from '../../../services/cobro.service';
import { PopupFindMatriculaComponent } from './../../../shared/popups/popup-find-matricula/popup-find-matricula.component';
import { AlertServiceService } from '../../../services/alert-service.service';
import { PopupRealizarFacturaComponent } from './../../../shared/popups/popup-realizar-factura/popup-realizar-factura.component';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-matricula-cobro',
  templateUrl: './matricula-cobro.component.html',
  styleUrls: ['./matricula-cobro.component.scss']
})
export class MatriculaCobroComponent implements OnInit {


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
  _id_usuario: any[] = [];

  total = 0;
  total_seleccionado = 0;


  constructor(private cobroService: CobroService ,  private messageService: MessageService,
              public dialogService: DialogService,  private route: ActivatedRoute, 
              private alertServiceService: AlertServiceService,
              private excelService: ExcelService,    private router: Router, private filter: Filter ) {
   
    this.cols = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'mat_nombreyapellido', header: 'Psicólogo', width: '20%' },
        {field: 'mat_concepto', header: 'Concepto', width: '20%' },         
        {field: 'mat_descripcion', header: 'Descripción', width: '25%' },
        {field: 'mat_monto', header: 'Importe', width: '16%' },
        {field: 'mat_fecha_vencimiento', header: 'Vencimiento', width: '12%' },
        {field: 'mat_num_cuota', header: 'Cuota', width: '8%' },
        {field: 'mat_id_plan', header: 'Plan', width: '10%' },
        {field: 'mat_matricula', header: 'Matrícula', width: '12%' },
        
        {field: 'mat_estado', header: 'Estado' , width: '10%'},
        {field: 'id_usuario', header: 'Punto' , width: '8%'},
        ];
   
      }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;

    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    
  }



exportarExcel(){
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

  const ref = this.dialogService.open(PopupMovimientoComponent, {
  data,
   header: 'Editar ingreso',
   width: '98%',
   height: '95%'
  });

  ref.onClose.subscribe((PopupMovimientoComponent: any) => {

    if (PopupMovimientoComponent) {
      //this.loadMovimientoRegistro();
    }
  });

  }

  filtered(event) {
    
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;
    this.sumarValoresSeleccionados(this.elementosFiltrados) ;
}


realizarFactura() {
    console.log(this.selecteditems.length);
    if (this.selecteditems.length > 0) {
      this.selecteditems[0].psicologo = this.psicologo;
      let data:any = this.selecteditems;
      const ref = this.dialogService.open(PopupRealizarFacturaComponent, {
      data,
       header: 'Realizar factura',
       width: '98%',
       height: '90%'
      });
      
      ref.onClose.subscribe((PopupRealizarFacturaComponent: any) => {
         if (PopupRealizarFacturaComponent) {
          console.log(PopupRealizarFacturaComponent);
          this.getDeudaByMatricula(PopupRealizarFacturaComponent.mat_matricula_psicologo);
         }
      });
   
      
    } else {
      this.loading = false;
      this.alertServiceService.throwAlert('warning', 'No se ha seleccionado ningun registro', 'sin registros', '400');
    }
}

getDeudaByMatricula(mat_matricula_psicologo) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd HH:mm', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd HH:mm', 'en');
  console.log(userData['id']);

  try {
      this.cobroService.getDeudaByMatricula(mat_matricula_psicologo)
      .subscribe(resp => {

      if (resp[0]) {
        let i = 0;
        for (i = 0; i < resp.length; i++) {
          this.total =  this.total+ Number(resp[i]['mat_monto']);
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
  this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error,'');
  }


}


getDeudaByMatriculaAndEstado(mat_matricula_psicologo) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd HH:mm', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd HH:mm', 'en');
  console.log(userData['id']);

  try {
      this.cobroService.getDeudaByMatriculaAndEstado(mat_matricula_psicologo, 'A')
      .subscribe(resp => {

      if (resp[0]) {
        let i = 0;
        for (i = 0; i < resp.length; i++) {
          this.total =  this.total+ Number(resp[i]['mat_monto']);
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

buscarEntreFechas() {
  this.loading = true;
  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd HH:mm', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd HH:mm', 'en');
  try {
    this.cobroService.getDeudaBydMatriculaBetweenDates(this._fechaDesde, this._fechaHasta,'todos')
    .subscribe(resp => {

    if (resp[0]) {
      let i = 0;
      for (i = 0; i < resp.length; i++) {
        this.total =  this.total+ Number(resp[i]['mat_monto']);
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
this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error,'');
}
}

actualizarFechaDesde(event) {
  console.log(event);
  this.fechaDesde = event;
  console.log(new Date(this.fechaDesde));
}

actualizarFechaHasta(event) {
  console.log(event);
  this.fechaHasta = event;
  console.log(new Date(this.fechaHasta));
}


sumarValoresSeleccionados(vals: any) {
        // SUMO LO FILTRADO
        console.log(vals);
        this.total_seleccionado = 0;
        let i:number;
        let total_facturado = 0;
        let total_original = 0;
        let total_categoria = 0;
        let cantidad_practica = 0;
        for (i = 0; i < vals.length; i++) {
         this.total_seleccionado =  this.total_seleccionado+ Number(vals[i]['mat_monto']);
         }
  
}

listarDeudaTotal(matricula : string) {

  
  let data:any;
  const ref = this.dialogService.open(PopupFindMatriculaComponent, {
  data,
   header: 'Buscar matricula',
   width: '98%',
   height: '100%'
  });
  
  ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
     if (PopupFindMatriculaComponent) {
      console.log(PopupFindMatriculaComponent);
      this.psicologo = PopupFindMatriculaComponent;
      this.getDeudaByMatricula(PopupFindMatriculaComponent.mat_matricula_psicologo);
     }
  });
  
}


findMatricula() {

  let data:any;
  const ref = this.dialogService.open(PopupFindMatriculaComponent, {
  data,
   header: 'Buscar matricula',
   width: '98%',
   height: '100%'
  });
  
  ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
     if (PopupFindMatriculaComponent) {
      console.log(PopupFindMatriculaComponent);
      this.psicologo = PopupFindMatriculaComponent;
      this.getDeudaByMatriculaAndEstado(PopupFindMatriculaComponent.mat_matricula_psicologo);
     }
  });
   
  }


generarPdf() {
  /* 
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  console.log(this.elementos);
  if(!this.elementosFiltrados){
    this.elementosFiltradosImpresion = this.agendaTurno;
  }else{
    this.elementosFiltradosImpresion = this.elementosFiltrados;
  }
  let fecha = formatDate(this.fechaHoy, 'dd/MM/yyyy', 'en');
  var doc = new jsPDF('landscape');
  
 
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.line(10, 30, pageWidth - 10, 30);
  doc.setFontSize(12);
  doc.text('Agenda de pacientes', pageWidth/2, 20, null, null, 'center');
  doc.text('Emitido : '+_fechaEmision, pageWidth/2, 24, null, null, 'center');
  doc.setFontSize(8);
  doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);


   doc.autoTable(this.columns, this.elementosFiltradosImpresion,
      {
        margin: {horizontal: 5, vertical: 35},    
        bodyStyles: {valign: 'top'},
        styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
        columnStyles: {text: {cellWidth: 'auto'}}
      }
      );
      window.open(doc.output('bloburl')); */
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
  this._id_usuario = [];  

  resp.forEach(element => {
    this._mat_concepto.push(element['mat_concepto']);
    this._mat_num_cuota.push(element['mat_num_cuota']);
    this._mat_estado.push(element['mat_estado']);
    this._id_usuario.push(element['id_usuario']);
    /** SUMO LO FILTRADO */
    
  });
  
  // ELIMINO DUPLICADOS
  this._mat_concepto = this.filter.filterArray(this._mat_concepto);  
  this._mat_num_cuota = this.filter.filterArray(this._mat_num_cuota);
  this._mat_estado = this.filter.filterArray(this._mat_estado);
  this._id_usuario = this.filter.filterArray(this._id_usuario);



}


colorString(estado:string){
  
  if((estado === 'P')||(estado === null)) {
    return {'es-ingreso'  :'null' };
  }else{
    return {'es-egreso'  :'null' };
  }

}

}





