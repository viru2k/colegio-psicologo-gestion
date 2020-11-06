import { Component, OnInit } from '@angular/core';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { MatriculaService } from './../../../../services/matricula.service';
import { MessageService, DialogService } from 'primeng/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { Filter } from './../../../../shared/filter';
import { ExcelService } from './../../../../services/excel.service';
import { calendarioIdioma } from './../../../../config/config';
import { formatDate } from '@angular/common';
import { ObraSocialService } from './../../../../services/obra-social.service';
import { PopupOrdenEditarComponent } from './../popups/popup-orden-editar/popup-orden-editar.component';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-orden-auditar',
  templateUrl: './orden-auditar.component.html',
  styleUrls: ['./orden-auditar.component.scss']
})
export class OrdenAuditarComponent implements OnInit {

  cols: any[];
  es: any;
  loading = false;
  elemento: any[] = null;
  elementos: any[] = [];
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  columns: any;
  userData: any;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;

  _os_sesion: any[] = [];
  _os_sesion_codigo: any[] = [];

  constructor(private liquidacionService: LiquidacionService,
              private matriculaService: MatriculaService,
              private obraSocialService: ObraSocialService,
              private messageService: MessageService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              private excelService: ExcelService, private filter: Filter ) {

this.cols = [
{field: 'boton', header: '' , width: '6%'},
{field: 'mat_matricula', header: 'Matrícula', width: '12%' },
{field: 'mat_apellido_nombre', header: 'Psicólogo', width: '22%' },
{field: 'os_fecha', header: 'Fecha', width: '12%' },
{field: 'os_sesion', header: 'Sesión', width: '20%' },
{field: 'os_sesion_codigo', header: 'Código', width: '12%' },
{field: 'os_precio_sesion', header: 'Valor', width: '12%' },
{field: 'os_cantidad', header: 'Cantidad', width: '12%' },
{field: 'os_precio_total', header: 'Total', width: '12%' },
{field: 'pac_nombre', header: 'Paciente', width: '15%' },
{field: 'pac_dni', header: 'DNI' , width: '10%'},
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

]; }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;

    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
  }

  buscarOrdenes() {}
  
  buscarEntreFechas() {
  this.loading = true;
  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd', 'en');
  try {
    this.loading = true;
    this.liquidacionService.getLiquidacionOrdenBetweenDates(this._fechaDesde, this._fechaHasta, 'PEN')
    .subscribe(resp => {
      console.log(resp);
      this.elementos = resp;
      this.loading = false;
      this.realizarFiltroBusqueda(resp);
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


auditarOrdenes() {
  console.log(this.selecteditems.length);
  if (this.selecteditems.length > 0) {
    console.log(this.selecteditems);

    try {
      this.loading = true;
      this.liquidacionService.auditarOrdenes(this.selecteditems)
      .subscribe(resp => {
        this.buscarEntreFechas();
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

editarRegistro(element: any) {
  console.log(element);
  let data:any = this.selecteditems;
  const ref = this.dialogService.open(PopupOrdenEditarComponent, {
      data,
       header: 'Editar orden',
       width: '98%',
       height: '98%'
      });

  ref.onClose.subscribe((PopupOrdenEditarComponent: any) => {
         if (PopupOrdenEditarComponent) {
          console.log(PopupOrdenEditarComponent);
          this.buscarEntreFechas();
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
    seleccionados['fecha_carga'] =   formatDate(element['fecha_carga'], 'dd/MM/yyyy', 'es-Ar');  ;
    seleccionados['cuenta_nombre'] = element.cuenta_nombre ;
    seleccionados['tipo_comprobante'] = element.tipo_comprobante;
    seleccionados['concepto_cuenta'] = element.concepto_cuenta;
    seleccionados['proveedor_nombre'] = element.proveedor_nombre;
    seleccionados['comprobante_numero'] = element.comprobante_numero ;
    seleccionados['descripcion'] = element.descripcion;
    seleccionados['movimiento_tipo'] = element.movimiento_tipo;
    seleccionados['tipo_moneda'] = element.tipo_moneda;
    seleccionados['cantidad'] = element.importe;
    seleccionados['cotizacion'] = element.cotizacion;

    seleccionados['total'] = element.total;
   // exportar.push(seleccionados);
    exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
    seleccionados = [];
    i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'listado_presentacion_detallado'+fecha_impresion);
}

generarPdf() {

  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  console.log(this.selecteditems);
  //if (!this.selecteditems) {

    //let fecha = formatDate(this.fec, 'dd/MM/yyyy', 'en');
  var doc = new jsPDF('landscape');

  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  let img = new Image();
  img.src = './assets/images/user-default.png';
  doc.addImage(img, 'PNG', 5, 5, 18, 18, undefined, 'FAST');

  doc.setLineWidth(0.4);
  doc.line(10, 30, pageWidth - 10, 30);
  doc.setFontSize(12);
  doc.text('Listado de deuda', pageWidth / 2, 20, null, null, 'center');
  doc.text('Emitido : ' + _fechaEmision, pageWidth / 2, 24, null, null, 'center');
  doc.setFontSize(8);
  //doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);
  doc.autoTable(this.columns, this.selecteditems,
        {
          margin: {horizontal: 5, vertical: 35},
          bodyStyles: {valign: 'top'},
          styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
          columnStyles: {text: {cellWidth: 'auto'}}
        }
        );
  window.open(doc.output('bloburl'));

}



realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._os_sesion = [];
  this._os_sesion_codigo = [];

  resp.forEach(element => {
    this._os_sesion.push(element.os_sesion);
    this._os_sesion_codigo.push(element.os_sesion_codigo);
    /** SUMO LO FILTRADO */
  });
  // ELIMINO DUPLICADOS
  this._os_sesion = this.filter.filterArray(this._os_sesion);
  this._os_sesion_codigo = this.filter.filterArray(this._os_sesion_codigo);
}



}
