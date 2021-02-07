import { AlertServiceService } from './../../../../services/alert-service.service';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-archivo-dos',
  templateUrl: './popup-archivo-dos.component.html',
  styleUrls: ['./popup-archivo-dos.component.scss']
})
export class PopupArchivoDosComponent implements OnInit {
  loading = false;
  listado = '';
  constructor( private liquidacionService: LiquidacionService,   private alertServiceService: AlertServiceService) { }

  ngOnInit() {
  }

  generarTxt(){
    this.loading = true;

    try {
        this.liquidacionService.createTextFileDos(this.listado)
         .subscribe(resp => {

        if (resp[0]) {

          console.log(resp);
          }
        this.loading = false;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, '');
         });
    } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error,'');
    }
  }

}
