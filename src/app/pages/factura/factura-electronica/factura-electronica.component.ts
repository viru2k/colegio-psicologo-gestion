import { Component, OnInit } from '@angular/core';
import { FacturacionService } from './../../../services/facturacion.service';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import swal from 'sweetalert2';
import { calendarioIdioma } from './../../../config/config';
// tslint:disable-next-line: max-line-length
import { PopupFacturaRenglonComponent } from './popups/popup-factura-renglon/popup-factura-renglon.component';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { FacturaElectronicaRenglon } from './../../../models/factura-electronica-renglon.model';
import { FacturaElectronica } from './../../../models/factura-electronica.model';
import { formatDate, CurrencyPipe } from '@angular/common';
import { FacturaAlicuotaAsociada } from '../../../models/factura_alicuota_asociada.model';


import { PopupProveedorFindComponent } from '../../../shared/components/popups/popup-proveedor-find/popup-proveedor-find.component';
import { BuscarComprobanteAfipComponent } from '../factura-electronica/popups/buscar-comprobante-afip/buscar-comprobante-afip.component';

@Component({
  selector: 'app-factura-electronica',
  templateUrl: './factura-electronica.component.html',
  styleUrls: ['./factura-electronica.component.css'],
  providers: [MessageService,DialogService]
})
export class FacturaElectronicaComponent implements OnInit {

  cols: any[];
  loading: boolean;
  loadingspinner: boolean;
  elementos: FacturaElectronicaRenglon[] = [];
  elementosPDF: any[] = [];
  elementosAlicuota: any[] = null;
  elementosMedicos: any[] = null;
  elementosComprobante: any[] = null;
  elementosConcepto: any[] = null;
  elementosDocumento: any[] = null;
  elementosPtoVta: any[] = null;
  elementosCondicionIva: any[]= null;
  selecteditems: FacturaElectronicaRenglon = null;
  elementoAlicuota:number= null;
  elementoMedicos:any= null;
  elementoComprobante:number= null;
  elementoConcepto:number= null;
  elementoDocumento:number= null;
  elementoPtoVta:number= null;
  elementoCondicionIva:number= null;
  selecteditemRegistro: FacturaElectronicaRenglon = null;
  selecteditemRenglon: FacturaElectronicaRenglon= null;
  facturaAlicuotaAsociada: FacturaAlicuotaAsociada[] = [];

  pto_vta:string = '0';
  _pto_vta:string = '0';
  _medico_nombre = '';
  _comprobante_nombre = '';
  factura_numero:string = '0';
  factura_numero_ceros:string = '0';
  comprobante_id = 0;
  nrodocumento:string = '0';
  observacion:string = '';
  cliente:string = '';
  CAE:string;
  CAE_vto:string;
  factura_nro:string = '0';
  _factura_nro:string;
  es:any;
  fecha:Date;
  _fecha:string;
  fechaDesde:Date;
  _fechaDesde:string;
  fechaHasta:Date;
  _fechaHasta:string;
  columns: any[];
  /***valores totales */
  cantidad:number = 0;
  subtotal:number = 0;
  subtotal_excento:number = 0;
  subtotal_iva:number = 0;
  total:number = 0;
  userData;
  medico_id:string;
  peticion:string;
  es_afip: string;
     movimiento: FacturaElectronicaRenglon;
  constructor(private facturacionService: FacturacionService, public dialogService: DialogService,private messageService: MessageService, private cp: CurrencyPipe ) {

    this.cols = [

      { field: 'descripcion', header: 'Descripción',  width: '55%' },
      { field: 'cantidad', header: 'Cantidad',  width: '10%' },
      {field: 'precio_unitario', header: 'P. unitario' , width: '10%' },
      { field: 'alicuota_descripcion', header: 'Alícuota',  width: '9%' },
      { field: 'iva', header: 'IVA',  width: '10%' },
      { field: 'total_renglon', header: 'Subtotal',  width: '10%' },
     ];


    this.columns = [
      {title: 'Descripcion', dataKey: 'descripcion'},
      {title: 'Can', dataKey: 'cantidad'},
      {title: 'Precio unit.', dataKey: 'precio_unitario'},
      {title: 'Alic.', dataKey: 'alicuota_descripcion'},
      {title: 'Iva', dataKey: 'iva'},
      {title: 'Importe', dataKey: 'total_renglon'},
  ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fecha = new Date();
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.userData  = JSON.parse(localStorage.getItem('userData'));
    this.getMedicosFacturan();


  }


  accion(event: FacturaElectronicaRenglon,overlaypanel: OverlayPanel,elementos: FacturaElectronicaRenglon){
    if(elementos){
      this.selecteditemRegistro = elementos;
    }

    console.log(this.selecteditemRegistro);
    overlaypanel.toggle(event);
    }

  actualizarFecha(event){
    console.log(event);
    this.fecha = event;
    console.log(new Date(this.fecha));
  }


  actualizarFechaDesde(event){
    console.log(event);
    this.fechaDesde = event;
    console.log(new Date(this.fechaDesde));
  }


  actualizarFechaHasta(event){
    console.log(event);
    this.fechaHasta = event;
    console.log(new Date(this.fechaHasta));
  }

  TipoComprobantesDisponibles(){
    this.loading = true;
    this.peticion = 'Cargando comprobante';
    try {
      this.facturacionService.TipoComprobantesDisponibles(this.medico_id)
      .subscribe(resp => {
          this.elementos = resp;
          this.loading = false;
          console.log(resp);
          this.loading = false;
          this.peticion = '';
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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

  TipoConceptosDisponibles(){
    this.loading = true;
    this.peticion = 'Cargando conceptos';
    try {
      this.facturacionService.TipoConceptosDisponibles(this.medico_id)
      .subscribe(resp => {
        this.loading = false;
        this.elementos = resp;
        this.loading = false;
        this.peticion = '';
        console.log(resp);
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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

  TipoDocumentosDisponibles(){
    this.loading = true;
    this.peticion = 'Cargando documentos';
    try {
      this.facturacionService.TipoDocumentosDisponibles(this.medico_id)
      .subscribe(resp => {

          this.elementos = resp;
          this.loading = false;
          this.peticion = '';
          console.log(resp);
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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

  Alicuota(){
    this.loading = true;
    this.peticion = 'Cargando alícuota';
    try {
      this.facturacionService.Alicuota()
      .subscribe(resp => {
          this.elementosAlicuota = resp;
          this.loading = false;
          this.peticion = '';
          console.log( this.elementosAlicuota);

      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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



  getMedicosFacturan(){
    this.loading = true;
    this.peticion = 'Cargando médicos';
    try {
      this.facturacionService.getMedicosFacturan()
      .subscribe(resp => {
          this.elementosMedicos = resp;
          this.loading = false;
          this.peticion = '';
          console.log( this.elementosMedicos);
          this.elementoMedicos = this.elementosMedicos['0'];
          console.log(this.elementoMedicos['id']);
          this.medico_id = this.elementoMedicos['id'];

          // UNA VEZ QUE TENGO EL DATO DEL MEDICO PROCEDO A BUSCAR TODOS LOS DEMAS CAMPOS

          this.Alicuota();
          this.Concepto();
          this.Documento();
          this.PtoVta();
          this.CategoriaIva();

      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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


  Comprobante(){
    this.loading = true;
    this.peticion = 'Cargando comprobantes';
    try {
      this.facturacionService.Comprobante()
      .subscribe(resp => {
          this.elementosComprobante = resp;

          this.loading = false;
          this.peticion = '';
          console.log( this.elementosComprobante);
          //this.elementoComprobante = this.elementosComprobante[3];
          this.elementoComprobante =  this.elementosComprobante.find(x => x.id === this.elementoMedicos['factura_comprobante_id']);
          console.log(this.elementoComprobante);

          if(this.elementoPtoVta){
            this.obtenerUltimaFactura();
          }
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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


  Concepto(){
    this.loading = true;
    this.peticion = 'Cargando concepto';
    try {
      this.facturacionService.Concepto()
      .subscribe(resp => {
          this.elementosConcepto = resp;
          this.loading = false;
          this.peticion = '';
          console.log(this.elementosConcepto);
          this.elementoConcepto = this.elementosConcepto[2];
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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


  Documento(){
    this.loading = true;
    this.peticion = 'Cargando documento';
    try {
      this.facturacionService.Documento()
      .subscribe(resp => {
          this.elementosDocumento = resp;
          this.loading = false;
          this.peticion = '';
          console.log(  this.elementosDocumento);
         //  this.elementoDocumento = this.elementosDocumento[7];
          this.elementoDocumento =  this.elementosDocumento.find(x => x.id == this.elementoMedicos['factura_documento_comprador_id']);
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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


  PtoVta(){
    this.loading = true;
    this.peticion = 'Cargando punto de venta';
    try {
      this.facturacionService.PtoVta()
      .subscribe(resp => {
            let i:number = 0;
            let resultado = resp;

            resultado.forEach(element => {
              resp[i]['punto_vta'] =  this.padLeft(resp[i]['punto_vta'], '0', 4);
              i++;
            });
            this.elementosPtoVta = resp;
          // DE ACUERDO AL PUNTO DE VENTA POR DEFECTO LO PRE SELECCIONO
        // console.log( this.elementosPtoVta.find(x => x.id == this.elementoMedicos['factura_punto_vta_id']));
            this.elementoPtoVta =  this.elementosPtoVta.find(x => x.id == this.elementoMedicos['factura_punto_vta_id']);
            this.pto_vta =  this.elementoPtoVta['punto_vta'];
        //  this._pto_vta =  this.elementoPtoVta['punto_vta'];
            this.loading = false;
            this.peticion = '';
            console.log(this.elementosPtoVta);
            this.Comprobante();
            this.obtenerMedico();
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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



  CategoriaIva(){
    this.loading = true;
    this.peticion = 'Cargando categoria';
    try {
      this.facturacionService.CategoriaIva()
      .subscribe(resp => {
          this.elementosCondicionIva = resp;

          this.elementoCondicionIva = this.elementosCondicionIva[4];
          this.loading = false;
          this.peticion = '';
          console.log(resp);
      },
      error => { // error path
        this.loading = false;
        this.peticion = '';
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

  padLeft(text:string, padChar:string, size:number): string {
    return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
}



guardarDatos(){

  console.log(this.elementoPtoVta);
  this._fecha = formatDate(this.fecha, 'yyyy-MM-dd', 'en');
  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd', 'en');
  console.log('elemento documento ' + this.elementoDocumento);
  console.log('elemento comprobante ' + this.elementoComprobante);
  console.log('elemento concepto ' + this.elementoConcepto);
  console.log('elemento pto. venta ' + this.pto_vta);
  let facturaElectronica = new FacturaElectronica('0', this.pto_vta, this.elementoComprobante['id'], this.elementoConcepto['id'],
  this.elementoDocumento['id'],this.nrodocumento,
  this.cliente,this.factura_numero, this._fecha, this._fechaDesde, this._fechaHasta,
  // tslint:disable-next-line: max-line-length
  (Math.round(this.subtotal * 100) / 100), this.subtotal_excento,(Math.round(this.subtotal_iva * 100) / 100),(Math.round(this.total * 100) / 100) ,
  this.facturaAlicuotaAsociada,this.elementos, '','', this.elementoMedicos['id'], this.observacion,this.elementoCondicionIva['categoria_iva'], this.es_afip);
  console.log(facturaElectronica);


  if((Number(this.elementoDocumento['id']) === 86 )||(Number(this.elementoDocumento['id']) === 80)) {
     console.log(Number(this.elementoDocumento['id']));
     console.log(this.nrodocumento.length);
     if(this.nrodocumento.length === 11){
      console.log(Number(this.elementoDocumento['id']));
     // this.generarPDF();
      this.CrearFactura(facturaElectronica);
     }else{

      swal({
        toast: false,
        type: 'warning',
        text: 'Error en la cantidad de dígitos del  CUIT / CUIL',
        title: 'Digitos incorrectos',
        showConfirmButton: false,
        timer: 3000
       });

     }
   }

  if ((Number(this.elementoDocumento['id']) !== 86 ) && (Number(this.elementoDocumento['id']) !== 80)) {
    console.log(Number(this.elementoDocumento['id']));
    console.log(this.nrodocumento.length);
    if((this.nrodocumento.length <=8)&&(this.nrodocumento.length >=5)){
      console.log(Number(this.elementoDocumento['id']));
     // this.generarPDF();
      this.CrearFactura(facturaElectronica);
    }else{
     swal({
       toast: false,
       type: 'warning',
       text: 'Error en la cantidad de dígitos',
       title: 'Digitos incorrectos',
       showConfirmButton: false,
       timer: 3000
     });
    }
  }


}


CrearFactura(facturaElectronica){
  this.loading = true;
  this.peticion = 'Creando factura';
  try {
    this.facturacionService.crearFactura(facturaElectronica)
    .subscribe(resp => {
        this.loading = false;
        this.peticion = '';

/* -------------------------------------------------------------------------- */
/*                 SI ES RECIBO , NO ES OFICIAL Y NO TRAE CAE                 */
/* -------------------------------------------------------------------------- */
        //if(facturaElectronica['factura_comprobante_id']=== 15){
        if (this.es_afip === 'NO') {
          this.CAE = '';
          this.CAE_vto = '';
          this._factura_nro = resp;
          this.factura_nro =  this.padLeft(String(resp),'0',8);
          swal({
            toast: false,
            type: 'success',
            text: 'confeccionando PDF',
            title: 'FACTURA Nº '+this.factura_nro +' GENERADA CORRETAMENTE',
            showConfirmButton: false,
            timer: 4000,
            onClose: () => {
              this.generarPDF();
            }
          });
        } else {

          this.CAE = resp[0]['cae'];
          this.CAE_vto = resp[0]['cae_vto'];
          this.factura_nro =  this.padLeft(String(resp[0]['factura_numero']),'0',8);
          swal({
            toast: false,
            type: 'success',
            text: 'confeccionando PDF',
            title: 'FACTURA Nº '+this.factura_nro +' GENERADA CORRETAMENTE',
            showConfirmButton: false,
            timer: 4000,
            onClose: () => {
              this.generarPDF();
            }
          });

        }

     //   this.generarPDF();
    },
    error => { // error path
      this.loading = false;
      this.peticion = '';
      console.log(error);
      console.log(error.message);
      swal({
          toast: false,
          type: 'error',
          text: error,
          showConfirmButton: true,
          confirmButtonColor: '#3085d6'
        });
     });
} catch (error) {

}
}

obtenerMedico(){
  console.log(this.elementoMedicos)
  this.medico_id = this.elementoMedicos['id'];
  this._medico_nombre = this.elementoMedicos['nombreyapellido'];
  this.loading = true;
  this.peticion = 'Obteniendo ultima factura y punto de venta';
  console.log(this.elementoComprobante);
  try {

    this.facturacionService.getDatoMedico( this.userData['id'])
    .subscribe(resp => {

      this.loading = false;
      this.peticion = '';
      console.log(  resp);

/* -------------------------------------------------------------------------- */
/*                      OBTENGO MUESTRO EL PUNTO DE VENTA                     */
/* -------------------------------------------------------------------------- */

      this.elementoPtoVta =  this.elementosPtoVta.find(x => x.id == resp[0]['pto_vta_id']);
      this.pto_vta =  this.elementoPtoVta['punto_vta'];
      console.log(resp[0]['punto_vta']);

/* -------------------------------------------------------------------------- */
/*                           OBTENGO EL COMPROBANTE                           */
/* -------------------------------------------------------------------------- */

      this.elementoComprobante =  this.elementosComprobante.find(x => x.id == resp[0]['factura_comprobante_id']);

    },
    error => { // error path
      this.loading = false;
      this.peticion = '';
      console.log(error);
      console.log(error.status);
      swal({
          toast: false,
          type: 'error',
          text: error,
          title: 'Algo no esta bien....',
          showConfirmButton: true,
        });
     });
} catch (error) {

}

}

obtenerPuntoVta(){
  console.log(this.elementoPtoVta);
  this._pto_vta = this.elementoPtoVta['id'];
  this.pto_vta = this.padLeft(this.elementoPtoVta['punto_vta'], '0', 4);
  console.log(this.pto_vta);
  //this.obtenerUltimaFactura();
}

onElementoDocumento(){

  console.log(this.elementoDocumento);
}

obtenerUltimaFactura(){
  this.loading = true;
  this.peticion = 'Obteniendo ultima factura y punto de venta';
  console.log(this.elementoComprobante);
  this._comprobante_nombre = this.comprobante_id = this.elementoComprobante['descripcion'];
  this.comprobante_id = this.elementoComprobante['id'];
  this.es_afip = this.elementoComprobante['es_afip'];
  console.log(this.es_afip);
  try {

    this.facturacionService.GetLastVoucher(this.pto_vta,this.elementoComprobante['id'],this.medico_id)
    .subscribe(resp => {

      this.loading = false;
      this.peticion = '';
      resp = resp+1;
      console.log(  resp);
      this.factura_numero = String(resp);
      this.factura_numero_ceros =this.padLeft(String(resp),'0',8);
    },
    error => { // error path
      this.loading = false;
      this.peticion = '';
      console.log(error);
      console.log(error.status);
      swal({
          toast: false,
          type: 'error',
          text: error,
          title: 'Algo no esta bien....',
          showConfirmButton: true,
        });
     });
} catch (error) {

}
}


agregarRenglon(){
  let data:any;
  //data = this.selecteditemRegistro;
  const ref = this.dialogService.open(PopupFacturaRenglonComponent, {
  data,
   header: 'Agregar registro de factura',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupOperacionCobroRegistroEditarComponent: FacturaElectronicaRenglon) => {
      if (PopupOperacionCobroRegistroEditarComponent) {
        console.log(PopupOperacionCobroRegistroEditarComponent);
        let movimiento: FacturaElectronicaRenglon;
        movimiento= PopupOperacionCobroRegistroEditarComponent;
        console.log();

/* -------------------------------------------------------------------------- */
/*        COMPROBANTES FACTURA B Y C CON SUS NOTAS DE CREDITO Y DEBITO        */
/* -------------------------------------------------------------------------- */


        this.elementos.push(movimiento);
        console.log(this.elementos);
       // GUARDO LAS ALICUOTAS ASOCIADAS

       // SE DEBE SEPARAR POR ALICUOTAS Y SUMAR LOS VALORES---- CORREGIR
        let alicuota_id = '0';
        let iva = 0;
        let precio_unitario = 0;
        let existe:Boolean = false;

        // ITERO PARA VERIFICAR SI EXISTE EL RENGLON CON LA ALICUOTA, SI EXISTE SUMO SUS VALORES
        for (let index = 0; index < this.facturaAlicuotaAsociada.length; index++) {
         console.log(movimiento['alicuota_id']);
         console.log(this.facturaAlicuotaAsociada[index]['id']);
         if(this.facturaAlicuotaAsociada){
          if(Number(movimiento['alicuota_id']) === Number(this.facturaAlicuotaAsociada[index]['id'])){
            console.log('valor existente')
            existe = true;
            precio_unitario = Number(this.facturaAlicuotaAsociada[index]['Importe']) + Number(movimiento['precio_unitario']);
            iva = Number(this.facturaAlicuotaAsociada[index]['importe_gravado']) + movimiento['iva'];
            this.facturaAlicuotaAsociada[index]['importe_gravado'] = (Math.round(iva* 100) / 100);
            this.facturaAlicuotaAsociada[index]['Importe'] =  (Math.round(precio_unitario* 100) / 100);
          }
        }
       }
       // SI EL RENGLON  DE ALICUOTA NO EXISTE LO CREO UNA UNICA VEZ
        if(!existe){
        //let _factura_alicuota_asociada = new FacturaAlicuotaAsociada(movimiento['alicuota_id'],Number(movimiento['iva']),Number(movimiento['precio_unitario']),'0' );
        let _factura_alicuota_asociada = new FacturaAlicuotaAsociada(movimiento['alicuota_id'],(Math.round(Number(movimiento['iva']) * 100) / 100), (Math.round(Number(movimiento['precio_unitario'])* 100) / 100),'0' );
        this.facturaAlicuotaAsociada.push(_factura_alicuota_asociada);
       }

        this.sumarValores();
      }
  });
}

// 20300712144


eliminarRegistro(result:any) {
  console.log(result);
  this.elementos = [];
  this.sumarValores();
}

sumarValores(){
  let i:number;

  this.total = 0;
  this.cantidad = 0;
  this.subtotal = 0;
  this.subtotal_iva = 0;
  this.subtotal_excento = 0;

  for(i=0;i < this.elementos.length;i++){
  this.cantidad = this.cantidad+ Number(this.elementos[i]['cantidad']);
  this.subtotal = this.subtotal+ Number(this.elementos[i]['total_sin_iva']);
  // AGREGAR VALIDACION SEGUN CODIGO IVA PARA 0%  Y PARA 21% O 10,5
  this.subtotal_iva = this.subtotal_iva+ Number(this.elementos[i]['iva']);
  this.total = this.total+ Number(this.elementos[i]['total_renglon']);

}


  for(i=0;i < this.facturaAlicuotaAsociada.length;i++){
  console.log(this.facturaAlicuotaAsociada[i]['id']);
  if(Number(this.facturaAlicuotaAsociada[i]['id']) ===3){
  this.subtotal_excento = this.subtotal_excento+ Number(this.facturaAlicuotaAsociada[i]['importe_gravado']);
  console.log('exento '+this.subtotal_excento);


  }

}

}

/*
buscarPaciente(){

  let data:any;
  const ref = this.dialogService.open(PopupPacienteObrasocialComponent, {
  data,
   header: 'Buscar paciente',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupPacienteObrasocialComponent: Paciente) => {
      if (PopupPacienteObrasocialComponent) {
        console.log(PopupPacienteObrasocialComponent);

       this.cliente =  PopupPacienteObrasocialComponent.apellido + ' ' + PopupPacienteObrasocialComponent.nombre;
       this.nrodocumento = String(PopupPacienteObrasocialComponent.dni);
       this.elementoDocumento =  this.elementosDocumento.find(x => x.id == 96);
       console.log(this.nrodocumento);
      }
  });

}
 */


buscarCliente(){

  let data:any;
  const ref = this.dialogService.open(PopupProveedorFindComponent, {
  data,
   header: 'Buscar proveedor',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupProveedorFindComponent: any) => {
      if (PopupProveedorFindComponent) {
        console.log(PopupProveedorFindComponent);

        this.cliente =  PopupProveedorFindComponent.proveedor_nombre;
        this.nrodocumento = String(PopupProveedorFindComponent.proveedor_cuit);
        this.elementoDocumento =  this.elementosDocumento.find(x => x.id === 80);
      // console.log(this.nrodocumento);
      }
  });

}

buscarFacturaAfip(){
  console.log(this.pto_vta);
  console.log(this._pto_vta);
  console.log(this._factura_nro);
  console.log(this.factura_numero);
  console.log(this.medico_id);


  this.loading = false;
  let data: any = [];
  data._pto_vta = this._pto_vta;
  data.factura_numero = this.factura_numero;
  data.comprobante_id = this.comprobante_id;
  data.medico_id = this.medico_id;
  data._medico_nombre = this._medico_nombre;
  data._comprobante_nombre = this._comprobante_nombre;
  data.pto_vta = this.pto_vta;
  const ref = this.dialogService.open(BuscarComprobanteAfipComponent, {
  data,
   header: 'Buscar facturas de afip',
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((BuscarComprobanteAfipComponent: any) => {
      if (BuscarComprobanteAfipComponent) {
        console.log(BuscarComprobanteAfipComponent);
      }
  });



}


generarPDF() {


  // GENERO EL FORMATO DE LOS COBROS

  this.elementosPDF = this.elementos;
  let i = 0;
  for (i = 0; i < this.elementosPDF.length; i++) {
    this.elementosPDF[i]['alicuota'] = Number(this.elementosPDF[i]['alicuota']);
    this.elementosPDF[i]['iva'] = Number(this.elementosPDF[i]['iva']);
    this.elementosPDF[i]['precio_unitario'] = Number(this.elementosPDF[i]['precio_unitario']);
    this.elementosPDF[i]['total_renglon'] = Number(this.elementosPDF[i]['total_renglon']);
    this.elementosPDF[i]['total_sin_iva'] = Number(this.elementosPDF[i]['total_sin_iva']);

  }

  this._fecha = formatDate(this.fecha, 'dd/MM/yyyy', 'en');
  const inicio_actividades =  formatDate(this.elementoMedicos['fecha_matricula'], 'dd/MM/yyyy', 'en');
  var doc = new jsPDF();
  /** valores de la pagina**/
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //borde contenedor
  doc.setLineWidth(0.3);
  doc.setDrawColor(207, 216, 220);
  doc.line(10, 10, pageWidth - 10, 10); //linea superior horizontal
  doc.line(10, 10, 10, 50); // linea vertical izquierda
  doc.line(pageWidth - 10, 10, pageWidth - 10, 50); // linea vertical derecha
  doc.line(10, 50, pageWidth - 10, 50); //linea inferior horizontal

  //borde factura letra
  doc.line((pageWidth/2)-6,10 , (pageWidth/2)-6, 23);  // linea vertical izquierda
  doc.line((pageWidth/2)+6,10 , (pageWidth/2)+6, 23);  // linea vertical derecha
  doc.line((pageWidth/2)-6,23 , (pageWidth/2)+6, 23); //linea inferior horizontal

  //borde fecha emision desde hasta

  doc.line(10, 55, pageWidth - 10, 55); //linea superior horizontal
  doc.line(10, 55, 10, 63); // linea vertical izquierda
  doc.line(pageWidth - 10, 55, pageWidth - 10, 63); // linea vertical derecha
  doc.line(10, 63, pageWidth - 10, 63); //linea inferior horizontal

  // borde datos del clinete

  doc.line(10, 65, pageWidth - 10, 65); //linea superior horizontal
  doc.line(10, 65, 10, 90); // linea vertical izquierda
  doc.line(pageWidth - 10, 65, pageWidth - 10, 90); // linea vertical derecha
  doc.line(10, 90, pageWidth - 10, 90); //linea inferior horizontal



  doc.line(10, pageHeight - 25,  10 , pageHeight - 15); // linea vertical izquierda
  doc.line(pageWidth - 10, pageHeight - 25, pageWidth - 10, pageHeight - 15); // linea vertical derecha
  doc.line(10, pageHeight -25, pageWidth - 10, pageHeight -25); //linea superior horizontal
  doc.line(10, pageHeight -15, pageWidth - 10, pageHeight -15); //linea inferior horizontal



// linea divisoria
  doc.line(pageWidth / 2, 23, pageWidth / 2, 50);
  doc.setFontSize(19);
  doc.setFontStyle('bold');
  doc.text(this.elementoComprobante['letra'], (pageWidth / 2) - 2.5, 17);
  doc.setFontStyle('normal');
  doc.setFontSize(6);
  doc.text('COD. ' + this.elementoComprobante['comprobante_codigo'], (pageWidth / 2) - 4.5, 21);
  let img = new Image();
  img.src = './assets/images/user-default.png';
  doc.addImage(img, 'PNG', 10, 10, 22, 22, undefined, 'FAST');
  doc.setFontSize(9);

  doc.text(this.elementoMedicos['nombreyapellido'], 15, 35);
  doc.setFontStyle('normal');
  doc.setFontSize(9);
  doc.text(this.elementoMedicos['domicilio'], 15, 40);
  doc.text(this.elementoMedicos['categoria_iva'],15 , 45);
  // izquierda
  doc.setFontSize(9);

/* -------------------------------------------------------------------------- */
/*                               DATOS DEL EMISO                              */
/* -------------------------------------------------------------------------- */
  doc.setFontStyle('bold');
  doc.setFontSize(11);
  doc.text(this.elementoComprobante['descripcion'], (pageWidth / 2) + 20, 20);
  doc.text('Comprobante: ' + this.pto_vta + ' - ' + this.factura_nro, (pageWidth / 2) + 20, 25);
  doc.setFontStyle('normal');
  doc.setFontSize(9);
  doc.text('Fecha Emisión: ' + this._fecha, (pageWidth / 2) + 20, 30);
  doc.text('C.U.I.T.: ' + this.elementoMedicos['cuit'], (pageWidth / 2) + 20, 35);
  doc.text('Ingresos brutos: ' + this.elementoMedicos['ing_brutos'], (pageWidth / 2) + 20, 40);
  doc.text('Inicio de actividades: ' + inicio_actividades, (pageWidth / 2) + 20, 45);
  doc.setLineWidth(0.4);


/* -------------------------------------------------------------------------- */
/*                              PERIODO DE FECHAS                             */
/* -------------------------------------------------------------------------- */

  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd', 'en');
  doc.text('Período Facturado   Desde: ' + formatDate(this.fechaDesde, 'dd/MM/yyyy', 'en'), 15, 60);
  doc.text('Hasta: ' + formatDate(this.fechaHasta, 'dd/MM/yyyy', 'en'), pageWidth / 2, 60);

/* -------------------------------------------------------------------------- */
/*                              DATOS DEL CLIENTE                             */
/* -------------------------------------------------------------------------- */

  doc.text(this.elementoDocumento['descripcion'] + ' : ' + this.nrodocumento, 15, 73);
  doc.text('Cliente: ' + this.cliente, 60, 73);
  doc.text('Condición frente al IVA: ' + this.elementoCondicionIva['categoria_iva'], 15, 78);
  doc.text('Observación: ' + this.observacion, 15, 83);

/* -------------------------------------------------------------------------- */
/*                             DATOS DE LA FACTURA                            */
/* -------------------------------------------------------------------------- */

  doc.setFontSize(10);
  doc.setFontStyle('bold');
  doc.text('Subtotal: '+ this.cp.transform(this.subtotal, '', 'symbol-narrow', '1.2-2'), 15, pageHeight -18);
  if((this.elementoComprobante['id'] === 6)||(this.elementoComprobante['id'] === 11)){}else{
    doc.text('Imp. IVA: '+ this.cp.transform(this.subtotal_iva, '', 'symbol-narrow', '1.2-2'), 75, pageHeight -18);
  }

  doc.text('Total: '+ this.cp.transform(this.total, '', 'symbol-narrow', '1.2-2'), pageWidth-50, pageHeight -18);
  // PIE DE LA FACTURA
  doc.text('CAE: ' + this.CAE, 15, pageHeight - 10);
  if (this.CAE === '') {} else {
    doc.text('Fecha de vencimiento de CAE: ' + formatDate(this.CAE_vto, 'dd/MM/yyyy', 'en') , (pageWidth / 2 ) + 20, pageHeight - 10);
  }

  doc.setFontStyle('normal');
  console.log(this.elementosPDF);

/* -------------------------------------------------------------------------- */
/*              SI ES FACTURA B O SIMILAR OMITO EL VALOR DEL IVA              */
/* -------------------------------------------------------------------------- */

  if ((this.elementoComprobante['id'] === 6) || (this.elementoComprobante['id'] === 7)
    || (this.elementoComprobante['id'] === 8) || (this.elementoComprobante['id'] === 11)
    || (this.elementoComprobante['id'] === 12) || (this.elementoComprobante['id'] === 13)) {
    for (i = 0; i < this.elementosPDF.length; i++) {
      this.elementosPDF[i]['alicuota'] = '';
      this.elementosPDF[i]['precio_unitario'] = this.elementosPDF[i]['total_renglon'];
      this.elementosPDF[i]['total_sin_iva'] = this.elementosPDF[i]['total_renglon'];
      this.elementosPDF[i]['iva'] = '0';
      this.elementosPDF[i]['alicuota_descripcion'] = '';
    }
  }


  doc.autoTable(this.columns, this.elementosPDF,
  {

      margin: {vertical: 95, right: 0, horizontal: -10},
      bodyStyles: {valign: 'top'},
      styles: {fontSize: 10, cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify', overflow: 'linebreak'},
      columnStyles: {descripcion: {columnWidth: 88}, cantidad: {columnWidth: 10}, precio_unitario: {columnWidth: 25},
      alicuota_descripcion: {columnWidth: 12},  iva: {columnWidth: 25}, total_renglon: {columnWidth: 25} }
  });
  window.open(doc.output('bloburl'));
  this.limpiarDatos();
  }





  limpiarDatos() {

  this.elementosPDF = [];
  this.elementos = [];
  this.pto_vta = '0';
  this.factura_numero = '0';
  this.factura_numero_ceros = '0';
  this.nrodocumento = '0';
  this.cliente = '';
  this.CAE = '';
  this.fecha = new Date();
  this.fechaDesde = new Date();
  this.fechaHasta = new Date();
  this.cantidad = 0;
  this.subtotal = 0;
  this.subtotal_excento = 0;
  this.subtotal_iva = 0;
  this.total = 0;
  this.facturaAlicuotaAsociada = [];
  this.observacion = '';
  this.cliente = '';
  this.getMedicosFacturan();


  }


}
