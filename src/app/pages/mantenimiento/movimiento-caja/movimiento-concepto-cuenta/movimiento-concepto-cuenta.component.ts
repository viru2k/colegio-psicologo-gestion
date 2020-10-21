import { Component, OnInit } from '@angular/core';
import { PopupMovimientoConceptoCuentaEditarComponent } from '../popup-movimiento-concepto-cuenta-editar/popup-movimiento-concepto-cuenta-editar.component';
import { MovimientoCajaService } from './../../../../services/movimiento-caja.service';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { AlertServiceService } from '../../../../services/alert-service.service';

@Component({
  selector: 'app-movimiento-concepto-cuenta',
  templateUrl: './movimiento-concepto-cuenta.component.html',
  styleUrls: ['./movimiento-concepto-cuenta.component.css']
})
export class MovimientoConceptoCuentaComponent implements OnInit {

  
  cols: any[];
  columns: any[];
  elementos:any[];
  selecteditems:any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private movimientoCajaService: MovimientoCajaService,private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) { 

    this.cols = [

      { field: 'concepto_cuenta', header: 'Concepto',  width: '80%' },
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
        this.movimientoCajaService.getMovimientoConceptoCuentas()
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

  const ref = this.dialogService.open(PopupMovimientoConceptoCuentaEditarComponent, {
  data,
   header: 'Editar concepto de cuenta',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoConceptoCuentaEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupMovimientoConceptoCuentaEditarComponent, {
  data,
   header: 'Crear concepto de cuenta',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoConceptoCuentaEditarComponent: any) => {

    if (PopupMovimientoConceptoCuentaEditarComponent) {
      this.loadlist();
    }
  });

}
}
