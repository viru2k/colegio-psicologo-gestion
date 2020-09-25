import { Component, OnInit } from '@angular/core';

import { UserService } from './../../../../services/user.service';
import { AlertServiceService } from './../../../../services/alert-service.service';

import { DynamicDialogConfig, DynamicDialogRef, DialogService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-popup-usuario',
  templateUrl: './popup-usuario.component.html',
  styleUrls: ['./popup-usuario.component.css']
})
export class PopupUsuarioComponent implements OnInit {

  
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(public config: DynamicDialogConfig ,private userService: UserService, private alertServiceService: AlertServiceService, 
              public dialogService: DialogService, private ref: DynamicDialogRef,
              private messageService: MessageService) {

    this.cols = [

      { field: 'email', header: 'Usuario',  width: '40%' },
      { field: 'nombreyapellido', header: 'Nombre y apellido',  width: '40%' },
      { field: '', header: 'Acción',  width: '20%' },

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist() {
    //console.log(this.config.data.id);
    this.loading = true;
    try {
        this.userService.getUsers()
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
              } else {
                this.elementos = null;
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


seleccionar(elemento) {

  this.ref.close(elemento);

}


}
