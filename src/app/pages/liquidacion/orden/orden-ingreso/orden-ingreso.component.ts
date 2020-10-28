import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';
import { formatDate, DatePipe } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';

import { calendarioIdioma } from './../../../../config/config';
import { ExcelService } from './../../../../services/excel.service';
import { Filter } from './../../../../shared/filter';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { ObraSocialService } from '../../../../services/obra-social.service';
import { PopupFindConvenioComponent } from './../../../../shared/popups/popup-find-convenio/popup-find-convenio.component';
import { PopupFindPacienteComponent } from '../../../../shared/popups/popup-find-paciente/popup-find-paciente.component';
import { Orden } from './../../../../models/orden.model';
import { MatriculaService } from './../../../../services/matricula.service';

@Component({
  selector: 'app-orden-ingreso',
  templateUrl: './orden-ingreso.component.html',
  styleUrls: ['./orden-ingreso.component.scss']
})
export class OrdenIngresoComponent implements OnInit {

  loading = false;
  cols: any[];
  es: any;
 
  elementos: any[] = [];
  elementosObraSocial: any[] = [];
  elementoObraSocial: any[] = [];
  elementosConvenio: any[] = [];
  elementoConvenio: any[] = [];
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  columns: any;
  userData: any;

  fecha: Date;
  os_nombre: string;
  psicologo_nombre: string;
  psicologo_id: number;
  cantidad = 1;
  elementoPaciente: any [] = [];
  paciente_nombre = '';
  paciente_id: number;
  _os_sesion: any[] = [];
  _os_sesion_codigo: any[] = [];

  orden: Orden;

  constructor(private matriculaService: MatriculaService,
              private obraSocialService: ObraSocialService,
              private messageService: MessageService,
              public dialogService: DialogService, 
              private alertServiceService: AlertServiceService,
              private excelService: ExcelService, private filter: Filter ) {

      this.cols = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'mat_matricula', header: 'Matrícula', width: '12%' },
        {field: 'mat_nombreyapellido', header: 'Psicólogo', width: '20%' },
        {field: 'mat_concepto', header: 'Concepto', width: '20%' },         
        {field: 'mat_descripcion', header: 'Descripción', width: '25%' },
        {field: 'mat_monto', header: 'Valor', width: '12%' },
        {field: 'mat_monto_final', header: 'Importe', width: '12%' },
        {field: 'mat_fecha_vencimiento', header: 'Vencimiento', width: '12%' },
        {field: 'mat_num_cuota', header: 'Cuota', width: '8%' },
        {field: 'mat_id_plan', header: 'Plan', width: '8%' },
        {field: 'mat_estado', header: 'Estado' , width: '10%'},
        {field: 'id_usuario', header: 'Punto' , width: '8%'},
        ];

      this.columns = [
          {title: 'Matrícula', dataKey: 'mat_matricula'},
          {title: 'Psicólogo', dataKey: 'mat_nombreyapellido'},
          {title: 'Concepto', dataKey: 'mat_concepto'},
          {title: 'Descripción', dataKey: 'mat_descripcion'},
          {title: 'Valor', dataKey: 'mat_monto'},
          {title: 'Importe', dataKey: 'mat_monto_final'},
          {title: 'Vencimiento', dataKey: 'mat_fecha_vencimiento'},
          {title: 'Cuota', dataKey: 'mat_num_cuota'},
          {title: 'Plan', dataKey: 'mat_id_plan'},
          {title: 'Estado', dataKey: 'mat_estado'},
          {title: 'Punto', dataKey: 'id_usuario'}

      ];
    }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;

    this.fecha = new Date();
    this.getObraSocial();
  }


  getObraSocial() {
    try {
      this.loading = true;
      this.obraSocialService.getObraSocial()
      .subscribe(resp => {
      if (resp[0]) {
        this.elementosObraSocial = resp;
        console.log(resp);
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

  
    changeElementoObraSocial(event) {
      console.log(event.value);
      this.getConvenioByObraSocial(event.value);
    }

    changeElementoConvenio(event) {
      console.log(event.value);
      
    }
  
  getConvenioByObraSocial(element: any) {
    try {
      this.loading = true;
      console.log(element);
      this.obraSocialService.getConvenioByObraSocial(element.id)
      .subscribe(resp => {
        let i = 0;
        if (resp[0]) {
        resp.forEach(element => {
          resp[i].os_sesion = element.os_sesion + ' - ' + element.os_sesion_codigo + ' - ' + element.id_precio +'$';
          i++;
        });
        this.elementoConvenio = resp;
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

  buscarPsicologo() {

      let data:any = this.selecteditems;
      const ref = this.dialogService.open(PopupFindConvenioComponent, {
      data,
       header: 'Buscar psicólogo',
       width: '98%',
       height: '98%'
      });
      ref.onClose.subscribe((PopupRealizarFacturaComponent: any) => {
         if (PopupRealizarFacturaComponent) {
          console.log(PopupRealizarFacturaComponent);
         }
      });

}

buscarPaciente() {


  if (this.paciente_nombre.length >= 4) {
    this.getPacienteByDni(this.paciente_nombre);
  } else {
     let data:any = this.paciente_nombre;
     const ref = this.dialogService.open(PopupFindPacienteComponent, {
    data,
     header: 'Buscar paciente',
     width: '98%',
     height: '98%'
    });

     ref.onClose.subscribe((PopupFindPacienteComponent: any) => {
       if (PopupFindPacienteComponent) {
       console.log(PopupFindPacienteComponent);
       }
    });
  }


}

agregar() {
 // this.orden = new Orden('0',mat_matricula, this.o)
}

limpiar() {

}

getPacienteByDni(dni: string) {
  try {
    this.loading = true;

    this.matriculaService.getPacienteByCondicion(dni, 'dni')
    .subscribe(resp => {
      if (resp[0]) {

      this.elementoPaciente = resp;
      this.paciente_nombre = resp[0].pac_nombre;
      console.log(this.elementoPaciente);
    } else {
      const data: any = null;
      const ref = this.dialogService.open(PopupFindPacienteComponent, {
        data,
         header: 'Buscar paciente',
         width: '98%',
         height: '98%'
        });
      ref.onClose.subscribe((PopupFindPacienteComponent: any) => {
           if (PopupFindPacienteComponent) {
           console.log(PopupFindPacienteComponent);
           }
        });
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


realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._os_sesion = [];
  this._os_sesion_codigo = [];


  resp.forEach(element => {
    this._os_sesion.push(element['os_sesion']);
    this._os_sesion_codigo.push(element['os_sesion_codigo']);

    /** SUMO LO FILTRADO */
    
  });
  
  // ELIMINO DUPLICADOS
  this._os_sesion = this.filter.filterArray(this._os_sesion);  
  this._os_sesion_codigo = this.filter.filterArray(this._os_sesion_codigo);




}


}
