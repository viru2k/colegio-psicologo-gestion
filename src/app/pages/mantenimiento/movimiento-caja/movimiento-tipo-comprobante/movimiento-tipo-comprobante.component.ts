import { Component, OnInit } from '@angular/core';

import { MovimientoCajaService } from './../../../../services/movimiento-caja.service';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { AlertServiceService } from '../../../../services/alert-service.service';
import { PopupMovimientoTipoComprobanteEditarComponent } from '../popup-movimiento-tipo-comprobante-editar/popup-movimiento-tipo-comprobante-editar.component';

@Component({
  selector: 'app-movimiento-tipo-comprobante',
  templateUrl: './movimiento-tipo-comprobante.component.html',
  styleUrls: ['./movimiento-tipo-comprobante.component.css']
})
export class MovimientoTipoComprobanteComponent implements OnInit {

  
  
  cols: any[];
  columns: any[];
  elementos:any[];
  selecteditems:any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private movimientoCajaService: MovimientoCajaService,private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) { 

    this.cols = [

      { field: 'tipo_comprobante', header: 'Comprobante',  width: '80%' },
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
        this.movimientoCajaService.getMovimientoConceptoTipoComprobantes()
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

  const ref = this.dialogService.open(PopupMovimientoTipoComprobanteEditarComponent, {
  data,
   header: 'Editar comprobante',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoTipoComprobanteEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupMovimientoTipoComprobanteEditarComponent, {
  data,
   header: 'Crear comprobante',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoTipoComprobanteEditarComponent: any) => {

    if (PopupMovimientoTipoComprobanteEditarComponent) {
      this.loadlist();
    }
  });

}
}
