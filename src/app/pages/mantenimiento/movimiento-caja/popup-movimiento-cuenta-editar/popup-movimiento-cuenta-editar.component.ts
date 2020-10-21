import { Component, OnInit } from '@angular/core';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovimientoCajaService } from '../../../../services/movimiento-caja.service';
import { AlertServiceService } from './../../../../services/alert-service.service';

@Component({
  selector: 'app-popup-movimiento-cuenta-editar',
  templateUrl: './popup-movimiento-cuenta-editar.component.html',
  styleUrls: ['./popup-movimiento-cuenta-editar.component.css']
})
export class PopupMovimientoCuentaEditarComponent implements OnInit {

  updateDataForm: FormGroup;
  elementos: any;
  categories: any[] = [{name: 'INGRESO', key: 'INGRESO'}, {name: 'EGRESO', key: 'EGRESO'}];
  
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  selectedCategory: any = null;

  constructor(public config: DynamicDialogConfig, private movimientoCajaService: MovimientoCajaService,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

              
    this.updateDataForm = new FormGroup({
      'id': new FormControl('', ),
      'cuenta_nombre': new FormControl('', Validators.required),
      'movimiento_tipo': new FormControl('INGRESO')
  });
  }

  ngOnInit() {
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.es_nuevo = false;
      this.updateDataForm.patchValue({cuenta_nombre: this.config.data.cuenta_nombre});
      this.updateDataForm.patchValue({movimiento_tipo: this.config.data.movimiento_tipo});
      //this.uda
      //this.selectedCategory = this.categories[1];
    }else{
      this.es_nuevo = true;
      console.log('es nuevo');
    }
  }

  seleccion(event) {
    console.log(event.data);
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
      this.movimientoCajaService.setMovimientoCuenta(this.updateDataForm.value)
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
      this.movimientoCajaService.putMovimientoCuenta(  this.updateDataForm.value, this.updateDataForm.value.id)
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
