import { Component, OnInit } from '@angular/core';
import { MovimientoCajaService } from './../../../../services/movimiento-caja.service';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { AlertServiceService } from '../../../../services/alert-service.service';
import { PopupMovimientoCuentaEditarComponent } from '../popup-movimiento-cuenta-editar/popup-movimiento-cuenta-editar.component';

@Component({
  selector: 'app-movimiento-cuenta',
  templateUrl: './movimiento-cuenta.component.html',
  styleUrls: ['./movimiento-cuenta.component.css']
})
export class MovimientoCuentaComponent implements OnInit {


  
  cols: any[];
  columns: any[];
  elementos:any[];
  selecteditems:any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private movimientoCajaService: MovimientoCajaService,private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) { 

    this.cols = [

      { field: 'cuenta_nombre', header: 'Cuenta',  width: '60%' },
      { field: 'movimiento_tipo', header: 'Movimiento',  width: '20%' },
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
        this.movimientoCajaService.getMovimientoCuentas()
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

  const ref = this.dialogService.open(PopupMovimientoCuentaEditarComponent, {
  data,
   header: 'Editar  cuenta',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoCuentaEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupMovimientoCuentaEditarComponent, {
  data,
   header: 'Crear  cuenta',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupMovimientoCuentaEditarComponent: any) => {

    if (PopupMovimientoCuentaEditarComponent) {
      this.loadlist();
    }
  });

}
}
