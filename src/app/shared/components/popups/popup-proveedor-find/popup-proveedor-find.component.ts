import { Component, OnInit } from '@angular/core';

import { DialogService } from 'primeng/components/common/api';
import { MessageService, DynamicDialogRef } from 'primeng/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { MovimientoCajaService } from './../../../../services/movimiento-caja.service';




@Component({
  selector: 'app-popup-proveedor-find',
  templateUrl: './popup-proveedor-find.component.html',
  styleUrls: ['./popup-proveedor-find.component.css']
})
export class PopupProveedorFindComponent implements OnInit {


  
  cols: any[];
  columns: any[];
  elementos:any[];
  selecteditems:any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private movimientoCajaService: MovimientoCajaService, private alertServiceService: AlertServiceService,
    public dialogService: DialogService, private messageService: MessageService, public ref: DynamicDialogRef ) {

    this.cols = [

      { field: 'proveedor_nombre', header: 'Proveedor',  width: '60%' },
      { field: 'proveedor_cuit', header: 'C.U.I.T',  width: '20%' },
      { field: 'proveedor_direccion', header: 'Dirección',  width: '20%' },
      { field: '', header: 'Acción',  width: '6%' },

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist(){

    this.loading = true;
    try {
        this.movimientoCajaService.getProveedores()
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

confirmar(elemento: any) {
  this.ref.close(elemento);

}



}
