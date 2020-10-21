
import { DynamicDialogConfig, MessageService, DynamicDialogRef, DialogService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { DatePipe, formatDate, CurrencyPipe } from '@angular/common';
import { calendarioIdioma } from './../../../config/config';
import swal from 'sweetalert2';
import { MovimientoCajaService } from './../../../services/movimiento-caja.service';
import { PopupProveedorFindComponent } from './../../../shared/components/popups/popup-proveedor-find/popup-proveedor-find.component';

import { AlertServiceService } from './../../../services/alert-service.service';


@Component({
  selector: 'app-popup-movimiento',
  templateUrl: './popup-movimiento.component.html',
  styleUrls: ['./popup-movimiento.component.css'],
  providers: [MessageService, DialogService]
})
export class PopupMovimientoComponent implements OnInit {
  esEditar = false;
  loading = false;
  es: any;
  formasPago: any[];
  updateDataForm: FormGroup;
  forma_pago: string ;
  _fechaHoy: string;  
  selectedForma: string;

  elementoConceptoCuenta: any[] = [];
  elementoCuenta: any[] = [];
  elementoTipoComprobante: any[] = [];
  elementoMoneda: any[] = [];

  constructor(public config: DynamicDialogConfig, private movimientoCajaService: MovimientoCajaService ,
              private alertServiceService: AlertServiceService,
              private messageService: MessageService , public ref: DynamicDialogRef, public dialogService: DialogService, private cp: CurrencyPipe ) {

   this.es = calendarioIdioma;

   this.updateDataForm = new FormGroup({
    'id': new FormControl(),
    'fecha_carga': new FormControl(new Date()),
    'comprobante_numero': new FormControl(''),    
    'mov_concepto_cuenta_id': new FormControl(1),
    'mov_cuenta_id': new FormControl(1),
    'concepto_cuenta': new FormControl(''),
    'descripcion': new FormControl(),
    'mov_tipo_comprobante_id': new FormControl(),
    'tipo_comprobante': new FormControl(),
    'cuenta_nombre': new FormControl(),     // debe concatenarsecon movimiento tipo 'movimiento_tipo': new FormControl(),
    'tiene_enlace_factura': new FormControl('NO'),
    'mov_tipo_moneda_id': new FormControl(''),
    'tipo_moneda': new FormControl(''),
    'importe': new FormControl(0),
    'cotizacion': new FormControl(1),
    'total': new FormControl(0),
    'liq_liquidacion_distribucion_id': new FormControl(0),
    'factura_encabezado_id': new FormControl(0),
    'paciente_id': new FormControl(0),
    'nombreyapellido_paciente': new FormControl(''),
    'nombreyapellido_proveedor': new FormControl(''),
    'proveedor_id': new FormControl(0),
    
  });

 
   console.log(this.config.data);
   if (this.config.data) {
    this.esEditar = true;
    this.updateDataForm.patchValue(this.config.data);
    this.updateDataForm.patchValue({fecha_carga: new Date(this.config.data.fecha_carga)});
    console.log(this.updateDataForm.value);

  }
}

  ngOnInit() {

   this.getMovimientoConceptoCuentas();
   this.getCuentas();
   this.getTipoComprobante();
   this.getMoneda();

  }



  calcularTotal() {
    this.updateDataForm.patchValue({total: (this.updateDataForm.value.importe * this.updateDataForm.value.cotizacion)}) ;
  }

/* -------------------------------------------------------------------------- */
/*                             CONCEPTO DE CUENTA                             */
/* -------------------------------------------------------------------------- */

    async getMovimientoConceptoCuentas() {

        try {
          await this.movimientoCajaService.getMovimientoConceptoCuentas()
          .subscribe(resp => {
          if (resp[0]) {
            this.elementoConceptoCuenta = resp;
            console.log(this.elementoConceptoCuenta);
            if(this.esEditar){
              // tslint:disable-next-line: max-line-length
              this.updateDataForm.get('concepto_cuenta').setValue(this.elementoConceptoCuenta.find(elem => elem.concepto_cuenta === this.config.data.concepto_cuenta));
            }
            }
          this.loading = false;
          },
          error => { 
              console.log(error.message);
              console.log(error.status);
              // tslint:disable-next-line: max-line-length
              this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
          });
      } catch (error) {
        // tslint:disable-next-line: max-line-length
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
      }
    }

    changeElementoConceptoCuenta(event) {
      console.log(event.value);
      this.updateDataForm.patchValue({mov_concepto_cuenta_id: event.value.id});
    }


/* -------------------------------------------------------------------------- */
/*                                   CUENTA                                   */
/* -------------------------------------------------------------------------- */

  async getCuentas() {

    try {
      await this.movimientoCajaService.getMovimientoCuentas()
      .subscribe(resp => {
        let i = 0;
        if (resp[0]) {
        resp.forEach(element => {
            resp[i].cuenta_nombre = element.cuenta_nombre + ' ' + element.movimiento_tipo;
            i++;
        });
        this.elementoCuenta = resp;
        console.log(this.elementoCuenta);
        //si no es nuevo le agrego el valor
        if(this.esEditar){
          // tslint:disable-next-line: max-line-length
          this.updateDataForm.get('cuenta_nombre').setValue(this.elementoCuenta.find(elem => elem.cuenta_nombre === (this.config.data.cuenta_nombre+ ' ' + this.config.data.movimiento_tipo)));
        }
        }
        this.loading = false;
      },
      error => {
          console.log(error.message);
          console.log(error.status);
          // tslint:disable-next-line: max-line-length
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
      });
  } catch (error) {
    this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
  }
  }

  changeElementoCuenta(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_cuenta_id: event.value.id});
  }

/* -------------------------------------------------------------------------- */
/*                              TIPO  COMPROBANTE                             */
/* -------------------------------------------------------------------------- */

async getTipoComprobante() {

  try {
    await this.movimientoCajaService.getMovimientoConceptoTipoComprobantes()
    .subscribe(resp => {
    if (resp[0]) {
      this.elementoTipoComprobante = resp;
      console.log(this.elementoTipoComprobante);
      if(this.esEditar){
        // tslint:disable-next-line: max-line-length
        this.updateDataForm.get('tipo_comprobante').setValue(this.elementoTipoComprobante.find(elem => elem.tipo_comprobante === this.config.data.tipo_comprobante));
      }
      }
    this.loading = false;
    },
    error => { 
        console.log(error.message);
        console.log(error.status);
        // tslint:disable-next-line: max-line-length
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
    });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
}
}

changeElementoTipoComprobante(event) {
  console.log(event.value);
  this.updateDataForm.patchValue({mov_tipo_comprobante_id: event.value.id});
}

/* -------------------------------------------------------------------------- */
/*                                   MONEDA                                   */
/* -------------------------------------------------------------------------- */

async getMoneda() {

  try {
    await this.movimientoCajaService.getMovimientoConceptoMonedas()
    .subscribe(resp => {
    if (resp[0]) {
      this.elementoMoneda = resp;
      console.log(this.elementoMoneda);
      if(this.esEditar){
        // tslint:disable-next-line: max-line-length
        this.updateDataForm.get('tipo_moneda').setValue(this.elementoMoneda.find(elem => elem.tipo_moneda === this.config.data.tipo_moneda));
      }
      }
    this.loading = false;
    },
    error => { 
        console.log(error.message);
        console.log(error.status);
        // tslint:disable-next-line: max-line-length
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
    });
} catch (error) {
  this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, error.status);
}
}


changeElementoMoneda(event) {
  console.log(event.value);
  this.updateDataForm.patchValue({mov_tipo_moneda_id: event.value.id});
}


buscarProveedor() {
  const data: any = null;
  const ref = this.dialogService.open(PopupProveedorFindComponent, {
  data,
   header: 'Buscar proveedor',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupProveedorFindComponent: any) => {
      if (PopupProveedorFindComponent) {
      
       console.log(PopupProveedorFindComponent);
       this.updateDataForm.patchValue({nombreyapellido_proveedor: PopupProveedorFindComponent.proveedor_nombre});
       this.updateDataForm.patchValue({proveedor_id: PopupProveedorFindComponent.id});

      }
  });

}


  actualizarDatos() {
    
    console.log(this.updateDataForm.value);
    if (this.esEditar) {
      try {
        this.movimientoCajaService.putMovimientoCaja(this.updateDataForm.value, this.config.data.id)
        .subscribe(resp => {
          this.alertServiceService.throwAlert('success','Se modificó el registro con éxito', '', '');
          this.ref.close(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
      this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
    } 
    } else {
      try {
        this.movimientoCajaService.setMovimientoCaja(this.updateDataForm.value)
        .subscribe(resp => {
          this.alertServiceService.throwAlert('success','Se creó el registro con éxito', '', '');
          this.ref.close();
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
      this.alertServiceService.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
    } 
    }
    
}
    
  }