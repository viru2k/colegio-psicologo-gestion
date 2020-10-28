import { Component, OnInit } from '@angular/core';
import { calendarioIdioma } from './../../../../../config/config';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { CobroService } from './../../../../../services/cobro.service';

@Component({
  selector: 'app-popup-concepto-agregar',
  templateUrl: './popup-concepto-agregar.component.html',
  styleUrls: ['./popup-concepto-agregar.component.scss']
})
export class PopupConceptoAgregarComponent implements OnInit {

  cols: any[];
  es: any;
  display: boolean;
  loading = false;
  elemento: any[] = null;
  selecteditems: any[] = [];
  userData: any;
  alicuota = 1;
  cuotas = 1;
  interes = 1;
  valor = 0;
  valorTotal = 0;
  concepto = '';

  
  constructor(private cobroService: CobroService,
              private alertServiceService: AlertServiceService) {

                this.cols = [
              
                  {field: 'mat_concepto', header: 'Concepto', width: '40%' },
                  {field: 'mat_descripcion', header: 'Descripción', width: '30%' },
                  {field: 'mat_monto', header: 'Importe', width: '20%' },
                  {field: 'mat_interes', header: 'Interes', width: '10%' },
                  {field: 'boton', header: '' , width: '6%'},
                  ];
               }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.loadConcepto();
  }

  confirmar(elem: any) {
    console.log(elem);
    this.concepto = elem.mat_concepto;
    this.valor = elem.mat_monto;


  }

  calcularDeuda() {
    if (this.concepto !== '') {
      this.valorTotal = this.valor * this.alicuota * this.interes;
    }
  }

  generarConcepto() {
    

  }

  loadConcepto() {
    this.loading = true;
  try {
      this.cobroService.getConcepto()
      .subscribe(resp => {

      if (resp[0]) {        
        this.elemento = resp;
          }
      this.loading = false;
      },
      error => { // error path
        this.loading = false;
        console.log(error.message);
        console.log(error.status);
        this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, '');
       });
  } catch (error) {
  this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error, ' ');
  }

  }


}
