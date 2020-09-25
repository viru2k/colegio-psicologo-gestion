import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { ObraSocialService } from '../../../../services/obra-social.service';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popup-obra-social-editar',
  templateUrl: './popup-obra-social-editar.component.html',
  styleUrls: ['./popup-obra-social-editar.component.scss']
})
export class PopupObraSocialEditarComponent implements OnInit {


  
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(public config: DynamicDialogConfig, private ObraSocialService: ObraSocialService,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

    this.updateDataForm = new FormGroup({
      'id': new FormControl(),
      'nombre': new FormControl('', Validators.required),
      'descripcion': new FormControl(),
      'es_habilitada': new FormControl('S', Validators.required)
  });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
    } else {
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
      this.ObraSocialService.settObraSocial(this.updateDataForm.value)
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
      this.ObraSocialService.putObraSocial(  this.updateDataForm.value, this.updateDataForm.value.id)
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
