import { Component, OnInit } from '@angular/core';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { Filter } from './../../../../shared/filter';
import { calendarioIdioma } from '../../../../config/config';
import { PopupLiquidacionExpedienteEditarComponent } from './../popup-liquidacion-expediente-editar/popup-liquidacion-expediente-editar.component';

@Component({
  selector: 'app-popup-liquidacion-liquidaciones',
  templateUrl: './popup-liquidacion-liquidaciones.component.html',
  styleUrls: ['./popup-liquidacion-liquidaciones.component.scss']
})
export class PopupLiquidacionLiquidacionesComponent implements OnInit {

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



  constructor(
              private liquidacionService: LiquidacionService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              private ref: DynamicDialogRef,
              private filter: Filter ) {

                this.cols = [

                  {field: 'id_liquidacion_generada', header: 'ID', width: '10%' },
                  {field: 'id_liquidacion', header: 'Liq. N°', width: '30%' },
                  {field: 'os_fecha', header: 'Periodo', width: '36%' },
                  {field: 'os_liq_estado', header: 'Estado', width: '22%' },
                  {field: 'boton', header: '' , width: '6%'},
                  ];
               }


  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.os_fecha = new Date();


    this.loadLiquidacion();

  }

  filtered(event) {
  //  this.sumarTotal(event.filteredValue);
}


  confirmar(event: any) {
    console.log(event);
    this.elemento = event;
    this.ref.close(this.elemento);

  }







  loadLiquidacion() {
    this.loading = true;
    try {
      this.liquidacionService.getLiquidaciones()
      .subscribe(resp => {
      this.elementos = resp;
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




/** ACCIONES */

colorRow(estado: string){

  if(estado == 'INGRESO') {
      return {'es-ingreso'  :'null' };
  }

  if(estado == 'EGRESO') {
      return {'es-egreso'  :'null' };
  }
}





colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
