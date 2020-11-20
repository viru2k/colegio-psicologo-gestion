import { Component, OnInit } from '@angular/core';
import { calendarioIdioma } from './../../../../../config/config';
import { AlertServiceService } from './../../../../../services/alert-service.service';
import { CobroService } from './../../../../../services/cobro.service';
import { DynamicDialogConfig } from 'primeng/api';
import { formatDate } from '@angular/common';
import { Concepto } from '../../../../../models/concepto.model';

@Component({
  selector: 'app-popup-concepto-agregar',
  templateUrl: './popup-concepto-agregar.component.html',
  styleUrls: ['./popup-concepto-agregar.component.scss']
})
export class PopupConceptoAgregarComponent implements OnInit {
  
  conceptoSeleccionado:any = [];
  conceptos: Concepto[] = [];
  cols: any[];
  es: any;
  display: boolean;
  loading = false;
  elemento: any[] = null;
  selecteditems: any[] = [];
  userData: any;  
  cuotas = 1;
  interes = 1;
  valor = 0;
  valorTotal = 0;
  concepto = '';

  
  constructor(private config: DynamicDialogConfig,
              private cobroService: CobroService,
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
    console.log(this.config.data);
    this.loadConcepto();
  }

  confirmar(elem: any) {
    console.log(elem);
    this.concepto = elem.mat_concepto;
    this.conceptoSeleccionado = elem;
    this.valor = elem.mat_monto;


  }

  calcularDeuda() {
    if (this.concepto !== '') {
      this.valorTotal = this.valor * this.interes * this.cuotas;
    }
  }

  generarConcepto() {
    let _concepto :Concepto = null;
    if (this.cuotas > 0) {
      for (let i = 0; i < this.cuotas; i++) {
        _concepto = new Concepto('0', this.conceptoSeleccionado['id_concepto'],
        this.userData.id, this.conceptoSeleccionado['mat_concepto'],  this.conceptoSeleccionado['mat_descripcion'],
        'A', '31/12/2099', formatDate(new Date(), 'dd/MM/yyyy', 'en'), '0', this.interes,
        this.config.data.mat_matricula_psicologo, this.valor * this.interes, this.valor * this.interes,
         this.config.data.mat_matricula_psicologo,  i + 1, '0', 'C' );

        this.conceptos.push(_concepto);
      }

      console.log(this.conceptos);
      this.guardarConcepto();
    }

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

  guardarConcepto() {
    this.loading = true;
    try {
      this.cobroService.setDeudaRegistros(this.conceptos)
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
