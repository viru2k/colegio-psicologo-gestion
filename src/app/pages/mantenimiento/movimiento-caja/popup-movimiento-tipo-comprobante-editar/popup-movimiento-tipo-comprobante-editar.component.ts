import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovimientoCajaService } from '../../../../services/movimiento-caja.service';
import { AlertServiceService } from './../../../../services/alert-service.service';


@Component({
  selector: 'app-popup-movimiento-tipo-comprobante-editar',
  templateUrl: './popup-movimiento-tipo-comprobante-editar.component.html',
  styleUrls: ['./popup-movimiento-tipo-comprobante-editar.component.css']
})
export class PopupMovimientoTipoComprobanteEditarComponent implements OnInit {

  
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(public config: DynamicDialogConfig, private movimientoCajaService: MovimientoCajaService,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

    this.updateDataForm = new FormGroup({
      'id': new FormControl('', ),
      'tipo_comprobante': new FormControl('', Validators.required)
  });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
    }else{
      this.es_nuevo = true;
      console.log('es nuevo');
    }
  }




  guardarDatos() {

    if (this.es_nuevo) {
      this.nuevaUnidad();
    } else {
      this.editarUnidad();
    }
  }

  nuevaUnidad() {
    this.loading = true;
    try {
      this.movimientoCajaService.setMovimientoConceptoTipoComprobante(this.updateDataForm.value)
      .subscribe(resp => {
          this.loading = false;
          console.log(resp);
          this.ref.close(resp);
      },
      error => { // error path
        console.log(error);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
     });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
}
  }

  editarUnidad() {

    console.log(this.updateDataForm);
    try {
      this.movimientoCajaService.putMovimientoConceptoTipoComprobante(  this.updateDataForm.value, this.updateDataForm.value.id)
      .subscribe(resp => {
        this.loading = false;
        console.log(resp);
        this.ref.close(resp);
      },
      error => { // error path
        console.log(error);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
     });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
}
  }

}
