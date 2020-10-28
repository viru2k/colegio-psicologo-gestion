import { Component, OnInit } from '@angular/core';
import { calendarioIdioma } from './../../../config/config';
import { AlertServiceService } from './../../../services/alert-service.service';
import { CobroService } from './../../..//services/cobro.service';
import { PopupConceptoMatriculaEditarComponent } from './popup-concepto-matricula-editar/popup-concepto-matricula-editar.component';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';

@Component({
  selector: 'app-concepto-matricula',
  templateUrl: './concepto-matricula.component.html',
  styleUrls: ['./concepto-matricula.component.scss']
})
export class ConceptoMatriculaComponent implements OnInit {

  
  cols: any[];
  es: any;
  display: boolean;
  loading = false;
  elemento: any[] = null;
  selecteditems: any[] = [];
  userData: any;

  
  constructor(private cobroService: CobroService,
              private alertServiceService: AlertServiceService,
              private messageService: MessageService,
              public dialogService: DialogService) {

                this.cols = [
                  {field: 'boton', header: '' , width: '6%'},
                  {field: 'mat_concepto', header: 'Concepto', width: '40%' },
                  {field: 'mat_monto', header: 'Importe', width: '20%' },
                  {field: 'mat_interes', header: 'Interes', width: '10%' },
                  {field: 'mat_descripcion', header: 'Descripción', width: '30%' }
                  ];
               }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.es = calendarioIdioma;
    this.loadConcepto();
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

  editarRegistro(elemento: any) {
  console.log(this.selecteditems.length);

  let data: any = elemento;
  const ref = this.dialogService.open(PopupConceptoMatriculaEditarComponent, {
    data,
     header: 'Editar concepto',
     width: '98%',
     height: '98%'
    });

  ref.onClose.subscribe((PopupConceptoMatriculaEditarComponent: any) => {
       if (PopupConceptoMatriculaEditarComponent) {
        this.loadConcepto();
       }
    });

}


nuevoRegistro(elemento: any) {
  console.log(this.selecteditems.length);

  let data: any = elemento;
  const ref = this.dialogService.open(PopupConceptoMatriculaEditarComponent, {
    data,
     header: 'Editar concepto',
     width: '98%',
     height: '98%'
    });

  ref.onClose.subscribe((PopupConceptoMatriculaEditarComponent: any) => {
       if (PopupConceptoMatriculaEditarComponent) {
        this.loadConcepto();
       }
    });

}

}
