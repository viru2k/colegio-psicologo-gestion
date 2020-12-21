import { formatDate } from '@angular/common';
import { PopupFindMatriculaComponent } from './../../../../shared/popups/popup-find-matricula/popup-find-matricula.component';
import { PopupConceptoEditarComponent } from './../../../matricula/matricula-cobro/popups/popup-concepto-editar/popup-concepto-editar.component';
import { calendarioIdioma } from 'src/app/config/config';
import { Filter } from './../../../../shared/filter';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { DialogService } from 'primeng/components/common/api';
import { CobroService } from './../../../../services/cobro.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-liquidacion-generar-deuda',
  templateUrl: './popup-liquidacion-generar-deuda.component.html',
  styleUrls: ['./popup-liquidacion-generar-deuda.component.scss']
})
export class PopupLiquidacionGenerarDeudaComponent implements OnInit {


  _mat_concepto: any[] = [];
  _mat_num_cuota: any[] = [];
  _mat_estado: any[] = [];
  _nombreyapellido: any[] = [];
  elementos: any[] = [];
  conceptoSeleccionado:any = [];

  fecha: Date;
  _fecha: string;
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
  total = 0;
  matricula: any[] = [];
  consulta = '';
  generacion: any[] = [];
  selectedDeuda: any;

  constructor(private config: DynamicDialogConfig,
              private cobroService: CobroService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              public ref: DynamicDialogRef,
              private filter: Filter ) {

                this.cols = [
                  {field: 'boton', header: '' , width: '6%'},
                  {field: 'mat_matricula', header: 'Matrícula', width: '8%' },
                  {field: 'mat_nombreyapellido', header: 'Psicólogo', width: '20%' },
                  {field: 'mat_concepto', header: 'Concepto', width: '20%' },
                  {field: 'mat_descripcion', header: 'Descripción', width: '25%' },
                  {field: 'mat_monto', header: 'Valor', width: '12%' },
                  {field: 'mat_monto_final', header: 'Importe', width: '12%' },
                  {field: 'mat_fecha_pago', header: 'F. Pago', width: '12%' },
                  {field: 'mat_fecha_vencimiento', header: 'F. Venc', width: '12%' },
                  {field: 'mat_num_cuota', header: 'Cuota', width: '8%' },
                  {field: 'mat_id_plan', header: 'Plan', width: '8%' },
                  {field: 'mat_estado', header: 'Estado' , width: '8%'},
                  {field: 'nombreyapellido', header: 'Usuario' , width: '14%'},
                  ];


                  this.generacion = [
                    {name: 'Todos', code: 'todos'},
                    {name: 'Psicólogo anual', code: 'psicologo'},
                    {name: 'Psicólogo desde una fecha', code: 'psicologofecha'}
                ];

               }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    console.log(this.config.data);
    this.fecha = new Date();
    this.selectedDeuda = this.generacion[0];

  }



  actualizarFechaPlan(event) {
    console.log(event);
    this.fecha= event;
    console.log(new Date(this.fecha));
  }


  changeElementoDeuda(event) {
    console.log(event.value);
    this.selectedDeuda = event.value;

  }


  sumarTotal() {
    let i = 0;
    for (i = 0; i < this.config.data.length; i++) {
      console.log(this.config.data[i]);
      this.total = this.total + Number(this.config.data[i].mat_monto_final);
    }
  }



  buscarMatricula() {

    const data: any = [];

    const ref = this.dialogService.open(PopupFindMatriculaComponent, {
    data,
     header: 'Editar concepto',
     width: '98%',
     height: '95%'
    });

    ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {

      this.matricula = PopupFindMatriculaComponent;
      console.log(this.matricula);
    });

    }

  editarRegistro(event) {

    const data: any = event;

    const ref = this.dialogService.open(PopupConceptoEditarComponent, {
    data,
     header: 'Editar concepto',
     width: '98%',
     height: '95%'
    });

    ref.onClose.subscribe((PopupConceptoEditarComponent: any) => {

      this.ref.close();
    });

    }



  generarDeuda() {

    this._fecha = formatDate(this.fecha , 'yyyy-MM-dd', 'en');
    console.log(this._fecha);

    console.log(this.selectedDeuda.code);
    this.consulta = this.selectedDeuda.code;
    if(this.matricula['mat_matricula_psicologo'] === undefined) {
      this.matricula['mat_matricula_psicologo'] = 0;
      console.log(this.matricula['mat_matricula_psicologo']);
    } else {
      console.log(this.matricula['mat_matricula_psicologo']);
    }

     this.loading = true;
    try {
      this.cobroService.generarDeudaPsicologo(this.matricula['mat_matricula_psicologo'], this._fecha, this.consulta )
      .subscribe(resp => {

      if (resp[0]) {
        this.elemento = resp;
        swal({
          title: 'DEUDA GENERADA' ,
          text: 'El proceso de deuda se genero correctamenta',
          type: 'success',
          showConfirmButton: false,
          timer: 2000

        });
        this.ref.close(resp);
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


/** ACCIONES */

colorRow(estado: string){

  if(estado == 'INGRESO') {
      return {'es-ingreso'  :'null' };
  }

  if(estado == 'EGRESO') {
      return {'es-egreso'  :'null' };
  }
}


realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._mat_concepto = [];
  this._mat_num_cuota = [];
  this._mat_estado = [];
  this._nombreyapellido = [];

  resp.forEach(element => {
    this._mat_concepto.push(element['mat_concepto']);
    this._mat_num_cuota.push(element['mat_num_cuota']);
    this._mat_estado.push(element['mat_estado']);
    this._nombreyapellido.push(element['nombreyapellido']);
    /** SUMO LO FILTRADO */

  });

  // ELIMINO DUPLICADOS
  this._mat_concepto = this.filter.filterArray(this._mat_concepto);
  this._mat_num_cuota = this.filter.filterArray(this._mat_num_cuota);
  this._mat_estado = this.filter.filterArray(this._mat_estado);
  this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);



}


colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
