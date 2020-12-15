import { formatDate } from '@angular/common';
import { Filter } from './../../../../shared/filter';
import { CobroService } from './../../../../services/cobro.service';
import { calendarioIdioma } from './../../../../config/config';
import { DialogService, MessageService } from 'primeng/components/common/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { MatriculaService } from './../../../../services/matricula.service';
import { ObraSocialService } from './../../../../services/obra-social.service';
import { DynamicDialogConfig } from 'primeng/api';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-generar-deuda',
  templateUrl: './popup-generar-deuda.component.html',
  styleUrls: ['./popup-generar-deuda.component.scss']
})
export class PopupGenerarDeudaComponent implements OnInit {

  es: any;
  cols: any[];
  fechaDesde: Date;
  _fechaDesde: string;
  columns: any[];
  elementos: any[];
  elemento: any[] = null;
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  modulosUsuario: any[];

  loading;
  userData: any;
  selectedElemento: any;
  selectedModulos: any[];
  mensaje: string;
  _mat_concepto: any[] = [];
  _mat_num_cuota: any[] = [];
  _mat_estado: any[] = [];
  _nombreyapellido: any[] = [];
  _mat_tipo_pago: any[] = [];
  estado = 'ANI';

  constructor(
    public config: DynamicDialogConfig,
    private obraSocialService: ObraSocialService,
    private matriculaService: MatriculaService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private cobroService: CobroService,
    private filter: Filter) {


      this.cols = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'mat_matricula', header: 'Mat.', width: '8%' },
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
        {field: 'mat_tipo_pago', header: 'Tipo' , width: '8%'},
        {field: 'nombreyapellido', header: 'Usuario' , width: '14%'},
        ];
    }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.fechaDesde = new Date();

    console.log(this.config.data);

    if(this.config.data) {

    }
}


actualizarFechaDesde(event) {
  console.log(event);
  this.fechaDesde = event;
  console.log(new Date(this.fechaDesde));
}

generarDeuda(){
  console.log(this.estado);
  if(this.config.data){

    // http://localhost/api-psicologo-gestion/public/api/deuda/psicologo?consulta=psicologofecha&anio=2021-08-30&mat_matricula_psicologo=1643
    this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd ', 'en');
    if(this.estado === 'ANU') {

    }
    if(this.estado === 'MES') {

    }
  } else {

  }
  this.getDeudaByMatriculaAndEstado(this.config.data.mat_matricula_psicologo, 'A');

}

getDeudaByMatriculaAndEstado(mat_matricula_psicologo, estado: string) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  this.es = calendarioIdioma;
  this.loading = true;

  console.log(userData['id']);

  try {
      this.cobroService.getDeudaByMatriculaAndEstado(mat_matricula_psicologo, estado)
      .subscribe(resp => {

      if (resp[0]) {
        let i = 0;

        this.realizarFiltroBusqueda(resp);

        this.elemento = resp;
        console.log(resp);
        }
      this.loading = false;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', error.message, '');
       });
  } catch (error) {
  this.alertServiceService.throwAlert('error', 'Error al cargar los registros' , error,'');
  }
}

filtered(event) {

  console.log(event.filteredValue);
  this.elementosFiltrados  = event.filteredValue;

}


realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._mat_concepto = [];
  this._mat_num_cuota = [];
  this._mat_estado = [];
  this._nombreyapellido = [];
  this._mat_tipo_pago = [];
  resp.forEach(element => {
    this._mat_concepto.push(element['mat_concepto']);
    this._mat_num_cuota.push(element['mat_num_cuota']);
    this._mat_estado.push(element['mat_estado']);
    this._nombreyapellido.push(element['nombreyapellido']);
    this._mat_tipo_pago.push(element['mat_tipo_pago']);
    /** SUMO LO FILTRADO */

  });

  // ELIMINO DUPLICADOS
  this._mat_concepto = this.filter.filterArray(this._mat_concepto);
  this._mat_num_cuota = this.filter.filterArray(this._mat_num_cuota);
  this._mat_estado = this.filter.filterArray(this._mat_estado);
  this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);
  this._mat_tipo_pago = this.filter.filterArray(this._mat_tipo_pago);



}



colorString(estado: string) {

  if ((estado === 'P') || (estado === null)) {
    return {'es-ingreso'  : 'null' };
  } else {
    return {'es-egreso'  : 'null' };
  }

}

}
