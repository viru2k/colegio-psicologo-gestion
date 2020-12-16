import { CobroService } from './../../../../services/cobro.service';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-concepto-matricula-editar',
  templateUrl: './popup-concepto-matricula-editar.component.html',
  styleUrls: ['./popup-concepto-matricula-editar.component.scss']
})
export class PopupConceptoMatriculaEditarComponent implements OnInit {



  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(public config: DynamicDialogConfig, private cobroService: CobroService,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

    this.updateDataForm = new FormGroup({
      'id_concepto': new FormControl(),
      'mat_concepto': new FormControl(),
      'mat_monto': new FormControl('0', Validators.required),
      'mat_interes': new FormControl('1', Validators.required),
      'mat_descripcion': new FormControl('SIN  DESCRIPCION', Validators.required)
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
      this.cobroService.setConcepto(this.updateDataForm.value)
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
      console.log(this.updateDataForm.value);

      this.cobroService.putConcepto(  this.updateDataForm.value, this.updateDataForm.value.id_concepto)
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
