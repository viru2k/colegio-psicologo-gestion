import { Component, OnInit, ViewChild } from '@angular/core';
import { MatriculaService } from './../../../services/matricula.service';
import { AlertServiceService } from './../../../services/alert-service.service';
import { MessageService, DialogService } from 'primeng/api';
import { PopupMatriculaEditarComponent } from '../popups/popup-matricula-editar/popup-matricula-editar.component';
import { Table } from 'primeng/table';
import { Filter } from './../../../shared/filter';
import { calendarioIdioma } from './../../../config/config';
import { formatDate } from '@angular/common';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PopupMatriculaObraSocialComponent } from '../popups/popup-matricula-obra-social/popup-matricula-obra-social.component';

@Component({
  selector: 'app-matricula-general',
  templateUrl: './matricula-general.component.html',
  styleUrls: ['./matricula-general.component.scss']
})
export class MatriculaGeneralComponent implements OnInit {

  es: any;
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditem: any;
  selecteditems: any;
  loading;
  dateFilters: any;
  _mat_sexo: any[] = [];
  _mat_localidad: any[] = [];
  display = false;

  @ViewChild('dt', { static: false }) table: Table;

  constructor(private userService: MatriculaService,
              private alertServiceService: AlertServiceService,
              public dialogService: DialogService,
              private messageService: MessageService,
              private filter: Filter) {

    this.cols = [
      { field: '', header: '',  width: '6%' },
      { field: 'mat_matricula_psicologo', header: 'Matricula',  width: '10%' },
      { field: 'mat_apellido', header: 'Apellido',  width: '20%' },
      { field: 'mat_nombre', header: 'Nombre',  width: '20%' },
      { field: 'mat_dni', header: 'DNI',  width: '10%' },
      { field: 'mat_sexo', header: 'Sexo',  width: '8%' },
      { field: 'mat_localidad', header: 'Localidad',  width: '12%' },
      { field: 'mat_tel_laboral', header: 'Tel. laboral',  width: '10%' },
      { field: 'mat_fecha_nacimiento', header: 'F. Nacimiento',  width: '10%' },
      { field: 'mat_fecha_egreso', header: 'F. Egreso',  width: '10%' },
      { field: 'mat_fecha_matricula', header: 'F. Matricula',  width: '10%' },
      { field: '', header: '',  width: '6%' },
      
      
   ];
  }

  ngOnInit() {
    this.es = calendarioIdioma  ;
    console.log('cargando insumo');

    this.loadlist();
  }


  detalle(evt: any, overlaypanel: OverlayPanel , event: any) {
    console.log(event);
    this.selecteditem = event;
    overlaypanel.toggle(evt);
  }

  loadlist(){

    this.loading = true;
    try {
        this.userService.getMatriculas()
        .subscribe(resp => {
          if(resp[0]){
            this.realizarFiltroBusqueda(resp);
            this.elementos = resp;
            console.log(this.elementos);
            console.log(resp);
          }
          this.loading = false;
        },
        error => { // error path
            console.log(error);
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
}

buscar(elemento: any) {
  console.log(elemento);
  const data: any = elemento;
  const ref = this.dialogService.open(PopupMatriculaEditarComponent, {
  data,
   header: 'Editar matrícula',
   width: '100%',
   height: '100%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupMatriculaEditarComponent: any) => {
    if (PopupMatriculaEditarComponent) {
      this.loadlist();
    }

  });

}

accionesmatricula() {
  
}

nuevo() {

  const data: any = null;
  const ref = this.dialogService.open(PopupMatriculaEditarComponent, {
  data,
   header: 'Crear matrícula',
   width: '100%',
   height: '100%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupMatriculaEditarComponent: any) => {
    if (PopupMatriculaEditarComponent) {
      this.loadlist();
    }
  });

}

realizarCobro() {

}

historiaPagos() {

}


asociarObraSocial() {
  

  const data: any = this.selecteditem;
  const ref = this.dialogService.open(PopupMatriculaObraSocialComponent, {
  data,
   header: 'Editar obras sociales de matrícula',
   width: '75%',
   height: '75%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupMatriculaObraSocialComponent: any) => {
    if (PopupMatriculaObraSocialComponent) {
      this.loadlist();
    }

  });
}


liquidaciones() {}

realizarFiltroBusqueda(resp: any[]){
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._mat_sexo = [];
  this._mat_localidad = [];

  resp.forEach(element => {
    this._mat_sexo.push(element['mat_sexo']);
    this._mat_localidad.push(element['mat_localidad']);
  });
  
  // ELIMINO DUPLICADOS
  this._mat_sexo = this.filter.filterArray(this._mat_sexo);  
  this._mat_localidad = this.filter.filterArray(this._mat_localidad);  
  


}


}

