import { PopupMatriculaDetalleLiquidacionComponent } from './../../popups/popup-matricula-detalle-liquidacion/popup-matricula-detalle-liquidacion.component';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Component, OnInit } from '@angular/core';
import { PopupLiquidacionExpedienteEditarComponent } from './../../popups/popup-liquidacion-expediente-editar/popup-liquidacion-expediente-editar.component';
import { formatDate } from '@angular/common';
import { calendarioIdioma } from 'src/app/config/config';
import { Filter } from './../../../../shared/filter';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { DialogService } from 'primeng/components/common/api';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { PopupLiquidacionGeneradaDetalleComponent } from './../../popups/popup-liquidacion-generada-detalle/popup-liquidacion-generada-detalle.component';
import { PopupLiquidacionLiquidacionesComponent } from './../../popups/popup-liquidacion-liquidaciones/popup-liquidacion-liquidaciones.component';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-liquidar-expediente-confeccionar',
  templateUrl: './liquidar-expediente-confeccionar.component.html',
  styleUrls: ['./liquidar-expediente-confeccionar.component.scss']
})
export class LiquidarExpedienteConfeccionarComponent implements OnInit {



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
  _os_fecha: string;
  os_fecha: Date;
  id_liquidacion = 0;
  descuenta_matricula = 'SI';
  TOTAL_CONCEPTOS = 0;
  TOTAL_DEDUCCIONES = 0;
  TOTAL_BRUTO = 0;
  TOTAL_NETO = 0;



  constructor(
              private liquidacionService: LiquidacionService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              private filter: Filter,
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
               }



  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.os_fecha = new Date();

  }

  filtered(event) {
    this.sumarTotal(event.filteredValue);
}




  detalle(evt: any, overlaypanel: OverlayPanel , event: any) {
    console.log(event);
    this.selecteditem = event;
    overlaypanel.toggle(evt);
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
        this.getExpedienteByIdLiquidacion();
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
        this.getExpedienteByIdLiquidacion();
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


  getExpedienteByIdLiquidacion() {
    this.loading = true;
    try {
      this.liquidacionService.getLiquidacionDetalleByidLiquidacion(String(this.id_liquidacion))
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

colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
