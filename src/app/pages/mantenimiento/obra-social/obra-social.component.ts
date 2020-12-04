import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';

import { FormGroup } from '@angular/forms';
import { calendarioIdioma } from './../../../config/config';
import { PopupObraSocialEditarComponent } from './popup-obra-social-editar/popup-obra-social-editar.component';
import { ObraSocialService } from '../../../services/obra-social.service';
import { AlertServiceService } from './../../../services/alert-service.service';

@Component({
  selector: 'app-obra-social',
  templateUrl: './obra-social.component.html',
  styleUrls: ['./obra-social.component.scss']
})
export class ObraSocialComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private obraSocialService: ObraSocialService, private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) {

    this.cols = [

      { field: 'os_nombre', header: 'Obra social',  width: '50%' },
      { field: 'mat_obra_social', header: 'Descripcion',  width: '40%' },
      { field: 'es_habilitada', header: 'Habilitada',  width: '10%' },
      { field: '', header: 'Acción',  width: '6%' }

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist() {

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

  const ref = this.dialogService.open(PopupObraSocialEditarComponent, {
  data,
   header: 'Editar obra social',
   width: '60%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupObraSocialEditarComponent: any) => {

      this.loadlist();

  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PopupObraSocialEditarComponent, {
  data,
   header: 'Crear obra social',
   width: '60%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupObraSocialEditarComponent: any) => {

    if (PopupObraSocialEditarComponent) {
      this.loadlist();
    }
  });

}
}
