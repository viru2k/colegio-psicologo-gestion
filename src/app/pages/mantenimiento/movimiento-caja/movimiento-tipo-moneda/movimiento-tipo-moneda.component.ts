import { Component, OnInit } from '@angular/core';

import { MovimientoCajaService } from './../../../../services/movimiento-caja.service';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { AlertServiceService } from '../../../../services/alert-service.service';
import { PopupMovimientoTipoMonedaEditarComponent } from '../popup-movimiento-tipo-moneda-editar/popup-movimiento-tipo-moneda-editar.component';

@Component({
  selector: 'app-movimiento-tipo-moneda',
  templateUrl: './movimiento-tipo-moneda.component.html',
  styleUrls: ['./movimiento-tipo-moneda.component.css']
})
export class MovimientoTipoMonedaComponent implements OnInit {

 
  
  cols: any[];
  columns: any[];
  elementos:any[];
  selecteditems:any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private movimientoCajaService: MovimientoCajaService,private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) { 

    this.cols = [

      { field: 'tipo_moneda', header: 'Moneda',  width: '80%' },
      { field: '', header: 'Acción',  width: '20%' },

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist(){

    this.loading = true;
    try {
        this.movimientoCajaService.getMovimientoConceptoMonedas()
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
              }else{
                this.elementos =null;
              }
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error);

            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
}

buscar(elemento: any) {
  console.log(elemento);
  const data: any = elemento;

  const ref = this.dialogService.open(PopupMovimientoTipoMonedaEditarComponent, {
  data,
   header: 'Editar moneda',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoTipoMonedaEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupMovimientoTipoMonedaEditarComponent, {
  data,
   header: 'Crear moneda',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoTipoMonedaEditarComponent: any) => {

    if (PopupMovimientoTipoMonedaEditarComponent) {
      this.loadlist();
    }
  });

}
}
