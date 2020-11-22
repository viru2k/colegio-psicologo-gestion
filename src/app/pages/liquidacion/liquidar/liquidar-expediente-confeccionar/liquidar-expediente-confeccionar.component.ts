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
              private filter: Filter ) {

                this.cols = [
                  {field: 'boton', header: '' , width: '6%'},
                  {field: 'mat_matricula', header: 'Matrícula', width: '10%' },
                  {field: 'os_liq_bruto', header: 'Bruto', width: '12%' },
                  {field: 'os_ing_brutos', header: 'Ing. Br.', width: '12%' },
                  {field: 'os_lote_hogar', header: 'Lote H.', width: '12%' },
                  {field: 'os_gasto_admin', header: 'G. Adm.', width: '12%' },
                  {field: 'os_imp_cheque', header: 'Imp. Ch.', width: '12%' }, 
                  {field: 'os_desc_matricula', header: 'D. Matricula', width: '18%' },
                  {field: 'os_desc_fondo_sol', header: 'D. Fondo sol', width: '18%' },
                  {field: 'os_otros_ing_eg', header: 'D. Otros', width: '18%' },
                  {field: 'os_liq_neto', header: 'Neto', width: '12%' },
                  {field: 'num_comprobante', header: 'Comp.', width: '10%' },
                  {field: 'os_num_ing_bruto', header: 'Nº I.B', width: '10%' },
                  {field: 'id_liquidacion', header: 'ID', width: '8%' },
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



  actualizarFechaDesde(event) {
    console.log(event);
    this.fechaDesde = event;
    console.log(new Date(this.os_fecha));
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
      this.liquidacionService.liquidar(String(this.id_liquidacion), this.descuenta_matricula);

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


excelPsicologo() {}

excelProveedor() {}

colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
