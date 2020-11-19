import { Component, OnInit } from '@angular/core';

import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';

import { PopupProveedorEditarComponent } from './../proveedor-editar/popup-proveedor-editar.component';
import { AlertServiceService } from './../../../services/alert-service.service';
import { MovimientoCajaService } from './../../../services/movimiento-caja.service';


@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

 
  
  cols: any[];
  columns: any[];
  elementos:any[];
  selecteditems:any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private movimientoCajaService: MovimientoCajaService, private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) { 

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

buscar(elemento: any) {
  console.log(elemento);
  const data: any = elemento;

  const ref = this.dialogService.open(PopupProveedorEditarComponent, {
  data,
   header: 'Editar  proveedor',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupProveedorEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupProveedorEditarComponent, {
  data,
   header: 'Crear  cuenta',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupProveedorEditarComponent: any) => {

    if (PopupProveedorEditarComponent) {
      this.loadlist();
    }
  });

}
}
