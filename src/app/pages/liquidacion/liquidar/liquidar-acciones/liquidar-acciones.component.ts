import { PopupArchivoIngBrutosComponent } from './../../popups/popup-archivo-ing-brutos/popup-archivo-ing-brutos.component';
import { PopupArchivoDosComponent } from './../../popups/popup-archivo-dos/popup-archivo-dos.component';
import { PopupFindMatriculaComponent } from './../../../../shared/popups/popup-find-matricula/popup-find-matricula.component';
import { PopupLiquidacionGenerarDeudaComponent } from './../../popups/popup-liquidacion-generar-deuda/popup-liquidacion-generar-deuda.component';
import { PopupMatriculaDetalleLiquidacionComponent } from './../../popups/popup-matricula-detalle-liquidacion/popup-matricula-detalle-liquidacion.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Component, OnInit } from '@angular/core';
import { PopupLiquidacionExpedienteEditarComponent } from './../../popups/popup-liquidacion-expediente-editar/popup-liquidacion-expediente-editar.component';
import { formatDate, CurrencyPipe } from '@angular/common';
import { calendarioIdioma } from 'src/app/config/config';
import { Filter } from './../../../../shared/filter';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { DialogService } from 'primeng/components/common/api';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { PopupLiquidacionGeneradaDetalleComponent } from './../../popups/popup-liquidacion-generada-detalle/popup-liquidacion-generada-detalle.component';
import { PopupLiquidacionLiquidacionesComponent } from './../../popups/popup-liquidacion-liquidaciones/popup-liquidacion-liquidaciones.component';
import { ExcelService } from '../../../../services/excel.service';
import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-liquidar-acciones',
  templateUrl: './liquidar-acciones.component.html',
  styleUrls: ['./liquidar-acciones.component.scss']
})
export class LiquidarAccionesComponent implements OnInit {


  columns: any[] = [];
  _os_liq_numero: any[] = [];
  _os_nombre: any[] = [];
  elementos: any[] = [];
  conceptoSeleccionado:any = [];
  cols: any[];
  es: any;
  display: boolean;
  loading = false;
  elemento: any[] = null;
  selecteditems: any[] = [];
  selecteditem: any[] = [];
  userData: any;
  total = 0;
  ordenes = 0;
  liquidacionNumero = 0;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;
  _os_fecha: string;
  os_fecha: Date;
  fecha: Date;
  fecha_vencimiento: Date;
  _fecha_vencimiento: string;
  _fecha: string;
  id_liquidacion = 0;
  descuenta_matricula = 'SI';
  TOTAL_CONCEPTOS = 0;
  TOTAL_DEDUCCIONES = 0;
  TOTAL_BRUTO = 0;
  TOTAL_NETO = 0;
  proximo_numero = 0;
  proximo_numero_recibo = 0;
  psicologo = null;

  constructor(
              private liquidacionService: LiquidacionService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              private filter: Filter,
              private cp: CurrencyPipe,
              private excelService: ExcelService ) {

                this.cols = [
                  {field: 'boton', header: '' , width: '6%'},
                  {field: 'id_liquidacion_detalle', header: 'N°', width: '8%' },
                  {field: 'mat_matricula', header: 'Mat.', width: '8%' },
                  {field: 'mat_apellidoynombre', header: 'Psicólogo', width: '20%' },
                  {field: 'os_liq_bruto', header: 'Bruto', width: '12%' },
                  {field: 'os_ing_brutos', header: 'Ing. Br.', width: '12%' },
                  {field: 'os_lote_hogar', header: 'Lote H.', width: '12%' },
                  {field: 'os_gasto_admin', header: 'G. Adm.', width: '12%' },
                  {field: 'os_imp_cheque', header: 'Imp. Ch.', width: '12%' },
                  {field: 'os_desc_matricula', header: 'D. Mat.', width: '12%' },
                  {field: 'os_desc_fondo_sol', header: 'D. F. sol', width: '12%' },
                  {field: 'os_otros_ing_eg', header: 'D. Otros', width: '12%' },
                  {field: 'os_liq_neto', header: 'Neto', width: '12%' },
                  {field: 'num_comprobante', header: 'Comp.', width: '8%' },
                  {field: 'os_num_ing_bruto', header: 'Nº I.B', width: '8%' },
                  {field: 'mat_banco_nombre', header: 'Banco', width: '12%' },
                  {field: 'id_liquidacion', header: 'ID', width: '6%' },
                  ];

                  this.columns = [
                    {title: 'Liq.', dataKey: 'id_liquidacion_generada'},
                    {title: 'Bruto', dataKey: 'os_liq_bruto'},
                    {title: 'I.B.', dataKey: 'os_ing_brutos'},
                    {title: 'L. H.', dataKey: 'os_lote_hogar'},
                    {title: 'G. A.', dataKey: 'os_gasto_admin'},
                    {title: 'Imp. CH', dataKey: 'os_imp_cheque'},
                    {title: 'Matrícula', dataKey: 'os_desc_matricula'},
                    {title: 'F. solidario', dataKey: 'os_desc_fondo_sol'},
                    {title: 'Otros In Eg', dataKey: 'os_otros_ing_eg'},
                    {title: 'Neto', dataKey: 'os_liq_neto'},
                    {title: 'Comprobante', dataKey: 'num_comprobante'},
                    {title: 'Nº Ing. Bruto', dataKey: 'os_num_ing_bruto'},
                    {title: 'Fecha', dataKey: 'os_fecha'},
                ];
               }



  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.os_fecha = new Date();
    this.fecha = new Date();
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();



  }

  filtered(event) {
    this.sumarTotal(event.filteredValue);
}




  detalle(evt: any, overlaypanel: OverlayPanel , event: any) {
    console.log(event);
    this.selecteditem = event;
    overlaypanel.toggle(evt);
  }



listarLiquidacionByMatricula() {

  let data: any;
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
      this.liquidacionByMatricula(this.psicologo);
     }
  });
}

  detalleLiquidacion(elem: any){

    let data: any = this.selecteditem;
    const ref = this.dialogService.open(PopupLiquidacionGeneradaDetalleComponent, {
    data,
     header: 'Detalle de liquidación',
     width: '98%',
     height: '100%'
    });

    ref.onClose.subscribe((PopupLiquidacionGeneradaDetalleComponent: any) => {
       if (PopupLiquidacionGeneradaDetalleComponent) {
        console.log(PopupLiquidacionGeneradaDetalleComponent);
       }
    });

  }



  generarDeuda(){

    let data: any = this.selecteditem;
    const ref = this.dialogService.open(PopupLiquidacionGenerarDeudaComponent, {
    data,
     header: 'Generar liquidacion',
     width: '98%',
     height: '100%'
    });

    ref.onClose.subscribe((PopupLiquidacionGenerarDeudaComponent: any) => {
       if (PopupLiquidacionGenerarDeudaComponent) {
        console.log(PopupLiquidacionGenerarDeudaComponent);
       }
    });

  }

  editarLiquidacion(elem: any){

    let data: any = this.selecteditem;
    const ref = this.dialogService.open(PopupLiquidacionExpedienteEditarComponent, {
    data,
     header: 'Editar registro de liquidacion',
     width: '98%',
     height: '100%'
    });

    ref.onClose.subscribe((PopupLiquidacionExpedienteEditarComponent: any) => {
       if (PopupLiquidacionExpedienteEditarComponent) {
        console.log(PopupLiquidacionExpedienteEditarComponent);
        this.loadExpediente();
       }
    });

  }

  detalleCobro(elem: any){

    let data: any = this.selecteditem;
    const ref = this.dialogService.open(PopupMatriculaDetalleLiquidacionComponent, {
    data,
     header: 'Detalle de cobros asociados',
     width: '98%',
     height: '100%'
    });

    ref.onClose.subscribe((PopupMatriculaDetalleLiquidacionComponent: any) => {
       if (PopupMatriculaDetalleLiquidacionComponent) {
        console.log(PopupMatriculaDetalleLiquidacionComponent);
        this.BuscarLiquidacion();
       }
    });

  }

  loadExpediente() {
    this.loading = true;
    try {
      this.liquidacionService.getExpedienteByEstado('G')
      .subscribe(resp => {
      this.elementos = resp;

      this.sumarTotal(this.elementos);
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

  sumarTotal(_elementos) {
    console.log(_elementos);
    this.TOTAL_BRUTO = 0;
    this.TOTAL_CONCEPTOS = 0;
    this.TOTAL_DEDUCCIONES = 0;
    this.TOTAL_NETO = 0;
    let i = 0;
    for (i = 0; i < _elementos.length; i++) {
     // console.log(_elementos);
      this.TOTAL_DEDUCCIONES = this.TOTAL_DEDUCCIONES + Number(_elementos[i].os_ing_brutos) + Number(_elementos[i].os_lote_hogar) + Number(_elementos[i].os_gasto_admin) + Number(_elementos[i].os_imp_cheque);
      this.TOTAL_CONCEPTOS = this.TOTAL_CONCEPTOS + Number(_elementos[i].os_desc_matricula) + Number(_elementos[i].os_desc_fondo_sol) + Number(_elementos[i].os_otros_ing_eg);
      this.TOTAL_BRUTO =   this.TOTAL_BRUTO + Number(_elementos[i].os_liq_bruto);
      this.TOTAL_NETO = this.TOTAL_NETO + Number(_elementos[i].os_liq_neto);

    }
  }




  editarRegistro(event) {

    const data: any = event;

    const ref = this.dialogService.open(PopupLiquidacionExpedienteEditarComponent, {
    data,
     header: 'Editar expediente',
     width: '98%',
     height: '95%'
    });

    ref.onClose.subscribe((PopupLiquidacionExpedienteEditarComponent: any) => {
      if(PopupLiquidacionExpedienteEditarComponent) {
        console.log(PopupLiquidacionExpedienteEditarComponent);
        this.getExpedienteByIdLiquidacion();
      }
    });

    }

    BuscarLiquidacion() {

      const data: any = event;

      const ref = this.dialogService.open(PopupLiquidacionLiquidacionesComponent, {
      data,
       header: 'Liquidaciones confeccionadas',
       width: '60%',
       height: '95%'
      });

      ref.onClose.subscribe((PopupLiquidacionLiquidacionesComponent: any) => {
        if(PopupLiquidacionLiquidacionesComponent) {
          console.log(PopupLiquidacionLiquidacionesComponent);
          this.id_liquidacion = PopupLiquidacionLiquidacionesComponent.id_liquidacion_generada;
          this.getExpedienteByIdLiquidacion();
        }
      });
  }

  archivotxtDos(){
    const data: any = event;

    const ref = this.dialogService.open(PopupArchivoDosComponent, {
    data,
     header: 'Generar archivo txt',
     width: '90%',
     height: '95%'
    });

    ref.onClose.subscribe((PopupArchivoDosComponent: any) => {
      if(PopupArchivoDosComponent) {

      }
    });
  }

  archivotxtIngBrutos(){
    const data: any = this.id_liquidacion;

    const ref = this.dialogService.open(PopupArchivoIngBrutosComponent, {
    data,
     header: 'Generar archivo txt ingresos brutos',
     width: '90%',
     height: '30%'
    });

    ref.onClose.subscribe((PopupArchivoIngBrutosComponent: any) => {
      if(PopupArchivoIngBrutosComponent) {

      }
    });
  }

  generarInformesDeuda(): void {
    this.loading = true;
    this._fecha = formatDate(new Date(this.fecha), 'yyyy-MM-dd', 'en');
    this._fechaDesde = formatDate(new Date(this.fechaDesde), 'yyyy-MM-dd', 'en');
    this._fechaHasta = formatDate(new Date(this.fechaHasta), 'yyyy-MM-dd', 'en');
    try {
      this.liquidacionService.getPadronDeudaByDate(this._fecha, this._fechaDesde, this._fechaHasta, 'deudoresxfecha' )
      .subscribe(resp => {
        let seleccionados: any[] = [];
        let exportar:any[] = [];
        let i = 0;
        resp.forEach(element => {

         seleccionados['APELLIDO'] = element.mat_apellido ;
         seleccionados['NOMBRE'] = element.mat_nombre;
         seleccionados['MATRICULA'] = element.mat_matricula_psicologo;
         exportar[i] = seleccionados;
         seleccionados = [];
         i++;
        });
        this.excelService.exportAsExcelFile(  exportar, 'listado_deudores_al_' + this._fecha);
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

  generarInformesDeudaPeriodo(): void {
    this.loading = true;
    this._fecha = formatDate(new Date(this.fecha), 'yyyy-MM-dd', 'en');
    this._fechaDesde = formatDate(new Date(this.fechaDesde), 'yyyy-MM-dd', 'en');
    this._fechaHasta = formatDate(new Date(this.fechaHasta), 'yyyy-MM-dd', 'en');
    try {
      this.liquidacionService.getPadronDeudaByDate(this._fecha, this._fechaDesde, this._fechaHasta, 'deudoresxfecha' )
      .subscribe(resp => {
        let seleccionados: any[] = [];
        let exportar:any[] = [];
        let i = 0;
        resp.forEach(element => {

         seleccionados['APELLIDO'] = element.mat_apellido ;
         seleccionados['NOMBRE'] = element.mat_nombre;
         seleccionados['MATRICULA'] = element.mat_matricula_psicologo;
         exportar[i] = seleccionados;
         seleccionados = [];
         i++;
        });
        this.excelService.exportAsExcelFile(  exportar, 'listado_deudores_al_' + this._fecha);
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

  generarInformesAlDia(): void{
    this.loading = true;
    this._fecha = formatDate(new Date(this.fecha), 'yyyy-MM-dd', 'en');
    this._fechaDesde = formatDate(new Date(this.fechaDesde), 'yyyy-MM-dd', 'en');
    this._fechaHasta = formatDate(new Date(this.fechaHasta), 'yyyy-MM-dd', 'en');
    try {
      this.liquidacionService.getPadronDeudaByDate(this._fecha, this._fechaDesde, this._fechaHasta, 'deudoresxfecha' )
      .subscribe(resp => {
        let seleccionados: any[] = [];
        let exportar:any[] = [];
        let i = 0;
        resp.forEach(element => {

         seleccionados['APELLIDO'] = element.mat_apellido ;
         seleccionados['NOMBRE'] = element.mat_nombre;
         seleccionados['MATRICULA'] = element.mat_matricula_psicologo;
         exportar[i] = seleccionados;
         seleccionados = [];
         i++;
        });
        this.excelService.exportAsExcelFile(  exportar, 'listado_al_dia_al_' + this._fecha);
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

  getExpedienteByIdLiquidacion() {
    this.loading = true;
    try {
      this.liquidacionService.getLiquidacionDetalleByidLiquidacion(String(this.id_liquidacion))
      .subscribe(resp => {
      this.elementos = resp;
      this.sumarTotal(this.elementos);
      this.loading = false;
      this.getProximoNumeroLiquidacion();
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





  getProximoNumeroLiquidacion() {
    this.loading = true;
    try {
      this.liquidacionService.getUltimoNroIngBrutos(String(this.id_liquidacion))
      .subscribe(resp => {
        console.log(resp);
      this.proximo_numero = resp[0].ultimo +1 ;
      this.loading = false;
      this.getProximoNumeroRecibo();
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


  getProximoNumeroRecibo() {
    this.loading = true;
    try {
      this.liquidacionService.getUltimoNroRecibo(String(this.id_liquidacion))
      .subscribe(resp => {
        console.log(resp);
      this.proximo_numero_recibo = resp[0].ultimo +1 ;
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

  GenerarRecibo() {
    swal({
    title: '¿Generar recibos para la liquidación?',
    text: 'Generar recibos de la liquidación',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, guardar!'
  }).then((result) => {
    if (result.value) {

    this.loading = true;
    try {
      this.liquidacionService.putActualizarNroRecibo(this.selecteditems, this.proximo_numero_recibo)
      .subscribe(resp => {
        console.log(resp);
      this.loading = false;
      this.getExpedienteByIdLiquidacion();
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
  }) ;

  }



  GenerarIngresosBrutos() {

    swal({
      title: '¿Generar ingresos brutos para la liquidacion?',
      text: 'Generación de registros de ingresos brutos',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, guardar!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        try {
          this.liquidacionService.putActualizarNroIngBrutos(this.selecteditems, this.proximo_numero)
          .subscribe(resp => {
            console.log(resp);
          this.loading = false;
          this.getExpedienteByIdLiquidacion();
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
    });


  }



  liquidacionByMatricula(psicologo: any) {
  //  console.log(psicologo);
  let listado: any[] = [];
    try {
      this.liquidacionService.getActuacionProfesionalByMatricula(psicologo.mat_matricula_psicologo)
      .subscribe(resp => {
     console.log(resp);
     this.excelService.exportAsExcelFile(  resp, 'certificado_actuacion_profesional');
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




  liquidar() {

    try {
      this.liquidacionService.liquidar(String(this.id_liquidacion), this.descuenta_matricula)
      .subscribe(resp => {
     console.log(resp);
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

  if (estado === 'INGRESO') {
      return {'es-ingreso'  : 'null' };
  }

  if (estado === 'EGRESO') {
      return {'es-egreso'  : 'null' };
  }
}


imprimirActuacionProfesional(){
  let _obra_social = '';
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  if(!this.selecteditems){
    this.selecteditems = [];
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
  doc.text('Detalle de actuación profesional', pageWidth / 2, 10, null, null, 'center');
  doc.setLineWidth(0.4);

  doc.setFontSize(8);
 // doc.text('Liquidación Nro : ' + this.config.data.id_liquidacion, pageWidth -60, 10, null, null);
 // doc.text('Fecha de liq. : ' +  formatDate(this.config.data.os_fecha , 'dd/MM/yyyy', 'en'), pageWidth -60, 13, null, null);
  doc.text( 'Matricula : ' +this.selecteditems[0].mat_matricula , pageWidth -60, 10, null, null);
  doc.text( this.selecteditems[0].mat_apellidoynombre, pageWidth -60,16 , null, null);


 // ORDENES
  doc.setFontSize(9);
  doc.setFontSize(8);
  doc.autoTable(this.columns, this.selecteditems,
        {
          showHead: 'firstPage',
          margin: {horizontal: 5, vertical: 30},
          bodyStyles: {valign: 'top'},
          styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
          columnStyles: {text: {cellWidth: 'auto'}}
        }
        );

  window.open(doc.output('bloburl'));


}


excelPsicologo() {
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
   seleccionados['CABECERA'] = 'D' ;
   seleccionados['FORMA_DE_PAGO'] = '50' ;
   seleccionados['TIPO_DE_COMPROBANTE'] = '' ;
   seleccionados['NUMERO_DE_COMPROBANTE'] = '' ;
   seleccionados['CUIL'] = element.mat_cuit ;
   seleccionados['DNI'] = element.mat_dni;
   seleccionados['NOMBREYAPELLIDO'] = element.mat_apellidoynombre;
   seleccionados['IMPORTE'] = element.os_liq_neto;
   seleccionados['CBU'] = element.mat_cbu ;
   seleccionados['FECHA_PAGO'] =   formatDate(element.os_fecha, 'dd/MM/yyyy', 'es-Ar');

   exportar[i] = seleccionados;
   seleccionados = [];
   i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'listado_pago_banco ' + this.selecteditems[0].mat_banco_nombre + fecha_impresion);

}

excelProveedor() {
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
   seleccionados['CABECERA'] = 'D' ;
   seleccionados['FORMA_DE_PAGO'] = '64' ;
   seleccionados['TIPO_DE_COMPROBANTE'] = '' ;
   seleccionados['NUMERO_DE_COMPROBANTE'] = '' ;
   seleccionados['CUIL'] = element.mat_cuit ;
   seleccionados['DNI'] = element.mat_dni;
   seleccionados['NOMBREYAPELLIDO'] = element.mat_apellidoynombre;
   seleccionados['IMPORTE'] = element.os_liq_neto;
   seleccionados['CBU'] = element.mat_cbu ;
   seleccionados['FECHA_PAGO'] =   formatDate(element.os_fecha, 'dd/MM/yyyy', 'es-Ar');
   seleccionados['FECHA_EMISION'] =   formatDate(element.os_fecha, 'dd/MM/yyyy', 'es-Ar');

   exportar[i] = seleccionados;
   seleccionados = [];
   i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'listado_pago_banco_proveedores ' + this.selecteditems[0].mat_banco_nombre + fecha_impresion);

}




generarPdfRentas(elem: any) {
  console.log(this.selecteditem);
  const _fechaEmision = formatDate(this.selecteditem['os_fecha'], 'dd/MM/yyyy', 'en');

  const userData = JSON.parse(localStorage.getItem('userData'));

  const doc = new jsPDF();
  /** valores de la pagina**/
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  doc.setFontSize(9);
  doc.text('DIRECCION GENERAL  DE RENTAS', 10, 15 );
  doc.text('CERTIFICADO DE RETENCION Nº ' + this.selecteditem['os_num_ing_bruto'], pageWidth - 80, 15 );
  doc.text('SAN JUAN', 10, 20);
  doc.text('FECHA: ' + _fechaEmision, pageWidth - 80, 20 );
  doc.line(10, 25, pageWidth - 10, 25);
  doc.setFontSize(8);
  doc.text('Impuestos sobre los ingresos brutos', 10, 30 );
  doc.text('COLEGIO DE PSICOLOGOS DE SAN JUAN', 10, 35 );
  doc.text('GRAL. ACHA 1056 SUR', 10, 40 );

  doc.text('AGENTE DE RETENCION 000-39646-7 77', pageWidth - 80, 30 );
  doc.text('C.U.I.T 30-63561825-2', pageWidth - 80, 35 );
  doc.line(10, 43, pageWidth - 10, 43);
  doc.text('VENDEDOR (Apellido y Nombre)', 10, 50 );
  doc.text(this.selecteditem['mat_apellidoynombre'], 10, 55 );

  doc.text('ACTIVIDAD: Psicologia', pageWidth - 80, 50 );
  doc.text('C.U.I.T: ' + this.selecteditem['mat_cuit'], pageWidth - 80, 55 );
  doc.text('Nº ing. brutos: ' + this.selecteditem['mat_ning_bto'], pageWidth - 80, 60 );
  doc.text('Domicilio: ' + this.selecteditem['mat_domicilio_particular'], pageWidth - 80, 65 );
  doc.line(10, 70, pageWidth - 10, 70);
  const imp_retenido = Number(this.selecteditem['os_ing_brutos']) + Number(this.selecteditem['os_lote_hogar']);
  doc.text('Monto imponible: ' + this.cp.transform(this.selecteditem['os_liq_bruto'], '', 'symbol-narrow', '1.2-2') , 10, 75 );
  doc.text('Ing. brutos: ' + this.cp.transform(this.selecteditem['os_ing_brutos'], '', 'symbol-narrow', '1.2-2') , 60, 75 );
  doc.text('Lote hogar: ' + this.cp.transform(this.selecteditem['os_lote_hogar'], '', 'symbol-narrow', '1.2-2') , 90, 75 );
  doc.text('Importe retenido: ' + this.cp.transform(imp_retenido, '', 'symbol-narrow', '1.2-2') , 130, 75 );
  doc.line(10, 80, pageWidth - 10, 80);
  doc.text('DUPLICADO', pageWidth / 2, 85, null, null, 'center');
 window.open(doc.output('bloburl'));

}

colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
