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
import { PopupFindMatriculaComponent } from './../../../../shared/popups/popup-find-matricula/popup-find-matricula.component';
import { LiquidacionService } from '../../../../services/liquidacion.service';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

@Component({
  selector: 'app-orden-ingreso',
  templateUrl: './orden-ingreso.component.html',
  styleUrls: ['./orden-ingreso.component.scss']
})
export class OrdenIngresoComponent implements OnInit {

  loading = false;
  buscando = false;
  cols: any[];
  es: any;

  elementos: any[] = [];
  elementosObraSocial: any[] = [];
  elementosConvenio: any[] = [];
  elementoConvenio: any = null;
  elementoObraSocial: any = null;
  elementoPaciente: any  = null;
  elementoPsicologo: any  = null;
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
  paciente_nombre = '';
  paciente_id: number;
  _os_sesion: any[] = [];
  _os_sesion_codigo: any[] = [];

  orden: Orden;

  constructor(private liquidacionService: LiquidacionService,
              private matriculaService: MatriculaService,
              private obraSocialService: ObraSocialService,
              private messageService: MessageService,
              public dialogService: DialogService,
              private alertServiceService: AlertServiceService,
              private excelService: ExcelService, private filter: Filter ) {

      this.cols = [
        {field: 'boton', header: '' , width: '6%'},
        {field: 'mat_matricula', header: 'Matrícula', width: '12%' },
        {field: 'mat_apellido_nombre', header: 'Psicólogo', width: '22%' },
        {field: 'os_fecha', header: 'Fecha', width: '12%' },
        {field: 'os_sesion', header: 'Sesión', width: '20%' },
        {field: 'os_sesion_codigo', header: 'Código', width: '12%' },
        {field: 'os_precio_sesion', header: 'Valor', width: '12%' },
        {field: 'os_cantidad', header: 'Cantidad', width: '12%' },
        {field: 'os_precio_total', header: 'Total', width: '12%' },
        {field: 'pac_nombre', header: 'Paciente', width: '15%' },
        {field: 'pac_dni', header: 'DNI' , width: '10%'},        
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
      this.elementoObraSocial = event.value;
      this.getConvenioByObraSocial(event.value);
    }

    changeElementoConvenio(event) {
      console.log(event.value);
      this.elementoConvenio = event.value;

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
          resp[i].os_sesion = element.os_sesion + ' - ' + element.os_sesion_codigo + ' - ' + element.id_precio + '$';
          i++;
        });
        this.elementosConvenio = resp;
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

    try {
      this.buscando = true;
      this.matriculaService.getMatricula(this.psicologo_nombre)
        .subscribe(resp => {
          if (resp[0]) {
            this.elementoPsicologo = resp[0];
            console.log(this.elementoPsicologo);
            // tslint:disable-next-line: max-line-length
            this.psicologo_nombre = this.elementoPsicologo.mat_matricula_psicologo + ' ' +  this.elementoPsicologo.mat_apellido + ' ' + this.elementoPsicologo.mat_nombre ;
            console.log(resp);
          } else {
            this. buscando = false;
            const data: any = this.selecteditems;
            const ref = this.dialogService.open(PopupFindMatriculaComponent, {
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
          this.buscando = false;
        },
        error => { // error path
            console.log(error);
            this.buscando = false;
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }

}

buscarPsicologoLista() {


  const ref = this.dialogService.open(PopupFindMatriculaComponent, {
   header: 'Buscar psicólogo',
   width: '98%',
   height: '98%'
  });
  ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
     if (PopupFindMatriculaComponent) {
      console.log(PopupFindMatriculaComponent);
      // tslint:disable-next-line: max-line-length
      this.elementoPsicologo = PopupFindMatriculaComponent;
      // tslint:disable-next-line: max-line-length
      this.psicologo_nombre = PopupFindMatriculaComponent.mat_matricula_psicologo + ' ' + PopupFindMatriculaComponent.mat_apellido + ' ' + PopupFindMatriculaComponent.mat_nombre ;
      console.log(this.elementoPsicologo);
     }
  });

}

buscarPaciente() {

  if (this.paciente_nombre.length >= 4) {
    this.getPacienteByDni(this.paciente_nombre);
  } else {
     const data: any = this.paciente_nombre;
     const ref = this.dialogService.open(PopupFindPacienteComponent, {
    data,
     header: 'Buscar paciente',
     width: '98%',
     height: '98%'
    });

     ref.onClose.subscribe((PopupFindPacienteComponent: any) => {
       if (PopupFindPacienteComponent) {
       console.log(PopupFindPacienteComponent);
       this.elementoPaciente = PopupFindPacienteComponent;
       this.paciente_nombre = PopupFindPacienteComponent.pac_nombre;
       }
    });
  }
}

buscarPacienteLista() {
     const ref = this.dialogService.open(PopupFindPacienteComponent, {
     header: 'Buscar paciente',
     width: '98%',
     height: '98%'
    });

     ref.onClose.subscribe((PopupFindPacienteComponent: any) => {
       if (PopupFindPacienteComponent) {
        console.log(PopupFindPacienteComponent);
        this.elementoPaciente = PopupFindPacienteComponent;
        this.paciente_nombre = PopupFindPacienteComponent.pac_nombre;
        console.log(this.elementoPaciente);
       }
    });

}

editarRegistro(elemen: any) {}

agregar() {
  const tmpfecha = formatDate(this.fecha, 'yyyy-MM-dd', 'en');
  const total = this.cantidad * Number(this.elementoConvenio.id_precio);
  console.log(this.elementoPsicologo );
  this.orden = new Orden('0', this.elementoPsicologo.mat_matricula_psicologo, this.elementoObraSocial.id, this.elementoConvenio.id,
                          this.elementoPaciente.id_paciente,  tmpfecha, this.cantidad, Number(this.elementoConvenio.id_precio),
                          total, 'PEN', '0', '' );
  console.log(this.orden);

  try {
    this.loading = true;
    this.liquidacionService.setOrden(this.orden)
    .subscribe(resp => {
      console.log(resp);
      this.loading = false;
      this.getLiquidacionByMatriculaAndEstado();
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

getLiquidacionByMatriculaAndEstado(){
  try {
    this.loading = true;
    this.liquidacionService.getLiquidacionByMatriculaAndEstado(this.elementoPsicologo.mat_matricula_psicologo, 'P')
    .subscribe(resp => {
      console.log(resp);
      this.elementos = resp;
      this.loading = false;
      this.realizarFiltroBusqueda(resp);
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

buscarOrdenes() {
  if (this.elementoPsicologo) {
    this.getLiquidacionByMatriculaAndEstado();
  }
}

limpiar() {
  this.cantidad = 1;
  this.elementoConvenio = null;
  this.elementoObraSocial = null;
  this.elementoPaciente = null;
  this.elementoPsicologo = null;
  this.elementos = [];
  this.elementosConvenio = [];
  this.paciente_nombre = '';
  this.psicologo_nombre = '';
  this.fecha = new Date();
}

getPacienteByDni(dni: string) {
  try {
    this.loading = true;

    this.matriculaService.getPacienteByCondicion(dni, 'dni')
    .subscribe(resp => {
      if (resp[0]) {
      this.elementoPaciente = resp[0];
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


public exportarExcelDetallado(){
  const fecha_impresion = formatDate(new Date(), 'dd-MM-yyyy-mm', 'es-Ar');  
  let seleccionados: any[] = [];
  let exportar:any[] = [];
  let i = 0;
  this.selecteditems.forEach(element => {
   // console.log(element['operacion_cobro_id']);
    seleccionados['fecha_carga'] =   formatDate(element['fecha_carga'], 'dd/MM/yyyy', 'es-Ar');  ;
    seleccionados['cuenta_nombre'] = element.cuenta_nombre ;
    seleccionados['tipo_comprobante'] = element.tipo_comprobante;
    seleccionados['concepto_cuenta'] = element.concepto_cuenta;
    seleccionados['proveedor_nombre'] = element.proveedor_nombre;
    seleccionados['comprobante_numero'] = element.comprobante_numero ;
    seleccionados['descripcion'] = element.descripcion;
    seleccionados['movimiento_tipo'] = element.movimiento_tipo;
    seleccionados['tipo_moneda'] = element.tipo_moneda;
    seleccionados['cantidad'] = element.importe;
    seleccionados['cotizacion'] = element.cotizacion;

    seleccionados['total'] = element.total;
   // exportar.push(seleccionados);
    exportar[i] = seleccionados;
  //  console.log(element);
   // console.log(seleccionados);
    seleccionados = [];
    i++;
  });
  this.excelService.exportAsExcelFile(  exportar, 'listado_presentacion_detallado'+fecha_impresion);
}

generarPdf() {

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

  doc.setLineWidth(0.4);
  doc.line(10, 30, pageWidth - 10, 30);
  doc.setFontSize(12);
  doc.text('Listado de deuda', pageWidth / 2, 20, null, null, 'center');
  doc.text('Emitido : ' + _fechaEmision, pageWidth / 2, 24, null, null, 'center');
  doc.setFontSize(8);
  //doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);
  doc.autoTable(this.columns, this.selecteditems,
        {
          margin: {horizontal: 5, vertical: 35},
          bodyStyles: {valign: 'top'},
          styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
          columnStyles: {text: {cellWidth: 'auto'}}
        }
        );
  window.open(doc.output('bloburl'));

}


realizarFiltroBusqueda(resp: any[]) {
  // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
  this._os_sesion = [];
  this._os_sesion_codigo = [];

  resp.forEach(element => {
    this._os_sesion.push(element.os_sesion);
    this._os_sesion_codigo.push(element.os_sesion_codigo);
    /** SUMO LO FILTRADO */
  });
  // ELIMINO DUPLICADOS
  this._os_sesion = this.filter.filterArray(this._os_sesion);
  this._os_sesion_codigo = this.filter.filterArray(this._os_sesion_codigo);
}


}
