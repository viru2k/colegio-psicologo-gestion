import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';

import { FormGroup } from '@angular/forms';
import { calendarioIdioma } from './../../../config/config';
import { ObraSocialService } from '../../../services/obra-social.service';
import { AlertServiceService } from './../../../services/alert-service.service';
import { PopupPmoEditarComponent } from '../obra-social/popup-pmo-editar/popup-pmo-editar.component';

@Component({
  selector: 'app-pmo',
  templateUrl: './pmo.component.html',
  styleUrls: ['./pmo.component.scss']
})
export class PmoComponent implements OnInit {

  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private obraSocialService: ObraSocialService, private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) {

    this.cols = [

      { field: 'os_sesion', header: 'Práctica',  width: '50%' },
      { field: 'os_sesion_codigo', header: 'Código',  width: '44%' },      
      { field: '', header: 'Acción',  width: '6%' }

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist(){

    this.loading = true;
    try {
        this.obraSocialService.getObraSocial()
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

  const ref = this.dialogService.open(PopupPmoEditarComponent, {
  data,
   header: 'Editar PMO',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupPmoEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupPmoEditarComponent, {
  data,
   header: 'Crear PMO',
   width: '60%',
   height: '50%'
  });

  ref.onClose.subscribe((PopupPmoEditarComponent: any) => {

    if (PopupPmoEditarComponent) {
      this.loadlist();
    }
  });

}
}