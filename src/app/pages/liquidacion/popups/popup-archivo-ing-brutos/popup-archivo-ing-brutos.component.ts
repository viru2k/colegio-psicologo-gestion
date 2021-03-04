import { DynamicDialogConfig } from 'primeng/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { LiquidacionService } from './../../../../services/liquidacion.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-popup-archivo-ing-brutos',
  templateUrl: './popup-archivo-ing-brutos.component.html',
  styleUrls: ['./popup-archivo-ing-brutos.component.scss']
})
export class PopupArchivoIngBrutosComponent implements OnInit {

  loading = false;
  listado = '';
  constructor( private liquidacionService: LiquidacionService,
      private alertServiceService: AlertServiceService,
      public config: DynamicDialogConfig) { }

  ngOnInit() {
    console.log(this.config.data);

  }

  generarTxt(){
    this.loading = true;

    try {
        this.liquidacionService.createTextFileIngBrutos(this.config.data)
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
