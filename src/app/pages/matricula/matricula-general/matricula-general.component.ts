import { ObraSocialService } from './../../../services/obra-social.service';
import { PopupGenerarDeudaComponent } from './../matricula-cobro/popup-generar-deuda/popup-generar-deuda.component';
import { ExcelService } from './../../../services/excel.service';
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
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

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
  selecteditemsObraSocial: any = [];
  elementoObraSocial: any = null;
  elementosObraSocial: any[] = [];
  os_nombre: string;
  loading;
  dateFilters: any;
  _mat_sexo: any[] = [];
  _mat_localidad: any[] = [];
  display = false;

  @ViewChild('dt', { static: false }) table: Table;

  constructor(private userService: MatriculaService,
              private obraSocialService: ObraSocialService,
              private alertServiceService: AlertServiceService,
              public dialogService: DialogService,
              private messageService: MessageService,
              private filter: Filter,
              private excelService: ExcelService) {

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

   this.columns = [
    {title: 'Matrícula', dataKey: 'mat_matricula_psicologo'},
    {title: 'Apellido', dataKey: 'mat_apellido'},
    {title: 'Nombre', dataKey: 'mat_nombre'},
    {title: 'Especialidad', dataKey: 'mat_especialidad'},
    {title: 'Orientación', dataKey: 'mat_orientacion'},
    {title: 'Abordaje', dataKey: 'mat_abordaje'},
    {title: 'Domicilio', dataKey: 'mat_domicilio_laboral'},
    {title: 'Telefono', dataKey: 'mat_telefono_laboral'},


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

  loadlist() {

    this.loading = true;
    try {
        this.userService.getMatriculas()
        .subscribe(resp => {
          if(resp[0]){
            this.realizarFiltroBusqueda(resp);
            this.elementos = resp;
            console.log(this.elementos);
            console.log(resp);
            this.getObraSocial();
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


getObraSocial() {
  try {
    this.loading = true;
    this.obraSocialService.getObraSocialHabilitado()
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
  this.elementoObraSocial = event.value;
  //this.getConvenioByObraSocial(event.value);
}

buscar(elemento: any) {
  console.log(elemento);
  const data: any = elemento;
  const ref = this.dialogService.open(PopupMatriculaEditarComponent, {
  data,
   header: 'Editar matrícula',
   width: '95%',
   height: '95%'
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
   width: '95%',
   height: '95%'
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
   height: '90%'
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



public exportarExcel(){


  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
   const regex = '.';

    seleccionados['mat_matricula_psicologo'] = element.mat_matricula_psicologo ;
    seleccionados['mat_apellido'] = element.mat_apellido;
    seleccionados['mat_nombre'] = element.mat_nombre;
    seleccionados['mat_fecha_nacimiento'] = formatDate(element['mat_fecha_nacimiento'], 'dd/MM/yyyy', 'es-Ar');
    seleccionados['mat_fecha_egreso'] = formatDate(element['mat_fecha_egreso'], 'dd/MM/yyyy', 'es-Ar');
    seleccionados['mat_fecha_matricula'] = formatDate(element['mat_fecha_matricula'], 'dd/MM/yyyy', 'es-Ar');
    seleccionados['mat_cuit'] = element.mat_cuit;
    seleccionados['mat_email'] = element.mat_email;
    seleccionados['mat_estado_matricula'] = element.mat_estado_matricula;
    seleccionados['mat_domicilio_laboral'] = element.mat_domicilio_laboral;
    seleccionados['mat_domicilio_particular'] = element.mat_domicilio_particular;
    seleccionados['mat_tel_laboral'] = element.mat_tel_laboral;
    seleccionados['mat_tel_particular'] = element.mat_tel_particular;
    seleccionados['mat_especialidad'] = element.mat_especialidad;
    seleccionados['mat_orientacion'] = element.mat_orientacion;
    seleccionados['mat_abordaje'] = element.mat_abordaje;
    seleccionados['mat_lugar_laboral'] = element.mat_lugar_laboral;
    seleccionados['mat_ning_bto'] = element.mat_ning_bto;
    seleccionados['mat_sexo'] = element.mat_sexo;

    seleccionados['nro_afiliado'] = element.nro_afiliado;

   // exportar.push(seleccionados);
    exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
    seleccionados = [];
    i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'listado_presentacion_resumido'+fecha_impresion);
}

exportarExcelObraSocial(){


  this.loading = true;
  try {
      this.userService.getPadronObraSocial(this.elementoObraSocial.id)
      .subscribe(resp => {
        if(resp[0]){
          this.realizarFiltroBusqueda(resp);
         this.selecteditemsObraSocial = resp;


  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditemsObraSocial.forEach(element => {
   // console.log(element['operacion_cobro_id']);
   const regex = '.';

    seleccionados['mat_matricula_psicologo'] = element.mat_matricula_psicologo ;
    seleccionados['mat_apellido'] = element.mat_apellido;
    seleccionados['mat_nombre'] = element.mat_nombre;
    seleccionados['mat_dni'] = element.mat_dni;
    seleccionados['mat_especialidad'] = element.mat_especialidad;
    seleccionados['mat_orientacion'] = element.mat_orientacion;
    seleccionados['mat_abordaje'] = element.mat_abordaje;
    seleccionados['mat_domicilio_particular'] = element.mat_domicilio_particular;
    seleccionados['mat_tel_particular'] = element.mat_tel_particular;
    seleccionados['mat_cuit'] = element.mat_cuit;
   // seleccionados['mat_lugar_laboral'] = element.mat_lugar_laboral;
    seleccionados['mat_ning_bto'] = element.mat_ning_bto;
    seleccionados['mat_domicilio_laboral'] = element.mat_domicilio_laboral;
    seleccionados['mat_tel_laboral'] = element.mat_tel_laboral;
    seleccionados['mat_fecha_egreso'] = formatDate(element['mat_fecha_egreso'], 'dd/MM/yyyy', 'es-Ar');
    seleccionados['mat_fecha_matricula'] = formatDate(element['mat_fecha_matricula'], 'dd/MM/yyyy', 'es-Ar');


   // exportar.push(seleccionados);
    exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
    seleccionados = [];
    i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'padron_obra_social_'+this.elementoObraSocial.os_nombre);
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

exportarPdfObraSocial(){


  this.loading = true;
  try {
      this.userService.getPadronObraSocial(this.elementoObraSocial.id)
      .subscribe(resp => {
        if(resp[0]){
          console.log(resp);
          this.selecteditemsObraSocial = resp;

  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  console.log(this.selecteditems);
  //if (!this.selecteditems) {

    //let fecha = formatDate(this.fec, 'dd/MM/yyyy', 'en');
        var doc = new jsPDF('landscape');

        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        let img = new Image();
        img.src = './assets/images/user-default.png';
        doc.addImage(img, 'PNG', 5, 5, 18, 18, undefined, 'FAST');
        doc.setFontSize(10);
        doc.text('Colegio de psicólgos', 30, 10, null, null);
        doc.text('de san juan', 30, 23, null, null);
        doc.setLineWidth(0.4);
        doc.line(10, 30, pageWidth - 10, 30);
        doc.setFontSize(12);
        doc.text('Listado de obra social', pageWidth / 2, 15, null, null, 'center');
        doc.text( this.elementoObraSocial.os_nombre, pageWidth / 2, 24, null, null, 'center');
        doc.setFontSize(8);
        //doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);
        doc.autoTable(this.columns, this.selecteditemsObraSocial,
        {
          margin: {horizontal: 5, vertical: 35},
          bodyStyles: {valign: 'top'},
          styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
          columnStyles: {text: {cellWidth: 'auto'}}
        }
        );
  window.open(doc.output('bloburl'));
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

generarDeuda(val: string){
  let data: any = null
  if(val === 'todos'){}

  if(val === 'psicologo'){
    data  = this.selecteditem;
  }
  console.log(data);
  const ref = this.dialogService.open(PopupGenerarDeudaComponent, {
  data,
   header: 'Generar deuda a psicólogo',
   width: '98%',
   height: '98%'
  });

  // tslint:disable-next-line: no-shadowed-variable
  ref.onClose.subscribe((PopupGenerarDeudaComponent: any) => {
    if (PopupGenerarDeudaComponent) {
      //this.loadlist();
    }

  });

}

}

