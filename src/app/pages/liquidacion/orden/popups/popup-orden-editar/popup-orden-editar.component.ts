import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-popup-orden-editar',
  templateUrl: './popup-orden-editar.component.html',
  styleUrls: ['./popup-orden-editar.component.scss']
})
export class PopupOrdenEditarComponent implements OnInit {


  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  selectedCategory: any = null;
  updateDataForm: FormGroup;

  constructor(public config: DynamicDialogConfig,
              private alertServiceService: AlertServiceService, public ref: DynamicDialogRef) {

              
    this.updateDataForm = new FormGroup({
      'id_os_liq_orden': new FormControl(''),
      'mat_matricula': new FormControl('', Validators.required),
      'id_obra_social': new FormControl('1'),
      'id_sesion': new FormControl('1'),
      'id_paciente': new FormControl('99'),
      'os_fecha': new FormControl(new Date()),
      'os_cantidad': new FormControl('1'),
      'os_precio_sesion': new FormControl('0'),
      'os_precio_total': new FormControl('0'),
      'os_estado_liquidacion': new FormControl('PEN'),
      'os_liq_numero': new FormControl('0'),
  });
  }

  ngOnInit() {
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.es_nuevo = false;
      this.updateDataForm.setValue( this.config.data);
     // this.updateDataForm.patchValue({cuenta_nombre: this.config.data.cuenta_nombre});
     // this.updateDataForm.patchValue({movimiento_tipo: this.config.data.movimiento_tipo});
      //this.uda
      //this.selectedCategory = this.categories[1];
    }else{
      this.es_nuevo = true;
      console.log('es nuevo');
    }
  }

}
