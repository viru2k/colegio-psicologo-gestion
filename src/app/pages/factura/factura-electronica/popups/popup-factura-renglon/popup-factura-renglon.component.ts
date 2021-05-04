import { Component, OnInit } from '@angular/core';
import { FacturacionService } from './../../../../../services/facturacion.service';

import swal from 'sweetalert2';
import { calendarioIdioma } from './../../../../../config/config';
import { DecimalPipe, CurrencyPipe, formatDate } from '@angular/common';
import { DialogService, MessageService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { FacturaElectronicaRenglon } from './../../../../../models/factura-electronica-renglon.model';
import { BuscarConceptoFacturaComponent } from './../buscar-concepto-factura/buscar-concepto-factura.component';

@Component({
  selector: 'app-popup-factura-renglon',
  templateUrl: './popup-factura-renglon.component.html',
  styleUrls: ['./popup-factura-renglon.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupFacturaRenglonComponent implements OnInit {
  cols: any[];
  loading: boolean;
  elementosAlicuota:any[] = null;
  elementoAlicuota:any= null;
  elemento:FacturaElectronicaRenglon;

  cantidad:number = 1;
  importe_unitario:number = 0;
  subtotal:string = '0';
  iva:string = '0';
  total:string = '0';
  concepto:string;
  userData: any[];

  constructor(private facturacionService: FacturacionService,private messageService: MessageService ,public ref: DynamicDialogRef, public config: DynamicDialogConfig ,public dialogService: DialogService,private cp: CurrencyPipe, private dp: DecimalPipe ) { }

  ngOnInit() {
    this.userData  = JSON.parse(localStorage.getItem('userData'));
    this.Alicuota();
  }



  Alicuota(){

    try {
      this.facturacionService.Alicuota()
      .subscribe(resp => {
          this.elementosAlicuota = resp;
          this.loading = false;
          console.log( this.elementosAlicuota);
          this.elementoAlicuota  = this.elementosAlicuota[0];
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            text: error.message,
            title: 'error.status',
            showConfirmButton: false,
            timer: 2000
          });
       });
  } catch (error) {

  }
  }



  buscarConcepto(){
    let data:any;
    //data = this.selecteditemRegistro;
    const ref = this.dialogService.open(BuscarConceptoFacturaComponent, {
    data,
     header: 'Buscar concepto',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((BuscarConceptoFacturaComponent:any) => {
        if (BuscarConceptoFacturaComponent) {
          console.log(BuscarConceptoFacturaComponent);
          this.concepto = BuscarConceptoFacturaComponent.descripcion;
          this.elementoAlicuota =  this.elementosAlicuota.find(x => x.iva_id == BuscarConceptoFacturaComponent.iva_id);
          this.importe_unitario = BuscarConceptoFacturaComponent.importe;
          console.log(this.elementoAlicuota);
          this.calcularRenglon();
        //  this.elementoAlicuota  = this.elementosAlicuota[BuscarConceptoFacturaComponent.factura_alicuota_id];
        }
    });
  }





  calcularRenglon(){
    //valido  datos antes de calcular
    let status:boolean;
    if(this.cantidad){

    }
    let _subtotal = this.cantidad * this.importe_unitario;
    let _iva =this.cantidad * this.importe_unitario * Number(this.elementoAlicuota['porcentaje_simple']);
    let _total = _subtotal *  Number(this.elementoAlicuota['porcentaje'])
    this.subtotal = this.cp.transform(_subtotal, '', 'symbol-narrow', '1.2-2') ;
    this.iva = this.cp.transform(_iva, '', 'symbol-narrow', '1.2-2') ;
    console.log(this.iva);
    //this.subtotal = this.cantidad * this.importe_unitario; // SUBTOTAL REFIERE AL  VALOR SIN IVA
    this.total = this.cp.transform(_total, '', 'symbol-narrow', '1.2-2') ;
  }
  guardarDatos(){
    let _subtotal = this.cantidad * this.importe_unitario;
    let _iva =this.cantidad * this.importe_unitario * Number(this.elementoAlicuota['porcentaje_simple']);
    let _total = _subtotal *  Number(this.elementoAlicuota['porcentaje'])
    this.subtotal = this.cp.transform(_subtotal, '', 'symbol-narrow', '1.2-2') ;
    this.iva = this.cp.transform(_iva, '', 'symbol-narrow', '1.2-2') ;
    //this.subtotal = this.cantidad * this.importe_unitario; // SUBTOTAL REFIERE AL  VALOR SIN IVA
    this.total = this.cp.transform(_total, '', 'symbol-narrow', '1.2-2') ;
    let tmp_elemento = new FacturaElectronicaRenglon('0','0',this.concepto, this.cantidad, this.importe_unitario, _subtotal, this.elementoAlicuota['iva_id'],
                                                       this.elementoAlicuota['porcentaje'], this.elementoAlicuota['descripcion'],_iva, _total , '0' ,  formatDate(new Date(), 'dd/MM/yyyy', 'en') ,  formatDate(new Date(), 'dd/MM/yyyy', 'en'), this.userData['id']);

  console.log(tmp_elemento);
    this.ref.close(tmp_elemento);
  }

}
