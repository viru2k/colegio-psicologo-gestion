import { DialogService } from 'primeng/components/common/api';
import { PacienteEditarComponent } from './../../../pages/mantenimiento/paciente/paciente-editar/paciente-editar.component';
import { Component, OnInit } from '@angular/core';
import { MatriculaService } from '../../../services/matricula.service';
import { FormGroup } from '@angular/forms';
import { AlertServiceService } from '../../../services/alert-service.service';
import { DynamicDialogRef, MessageService } from 'primeng/api';

@Component({
  selector: 'app-popup-find-paciente',
  templateUrl: './popup-find-paciente.component.html',
  styleUrls: ['./popup-find-paciente.component.scss']
})
export class PopupFindPacienteComponent implements OnInit {

  cols: any[];

  es:any;
  // LOADING
  loading: boolean;
  elemento: any = null;
  elementos: any[] = null;
  busquedaForm:FormGroup;
  busqueda = 'apellido';
  textoBusqueda = '';

  constructor(private matriculaService: MatriculaService,
              private messageService: MessageService,
              public dialogService: DialogService,
              public ref: DynamicDialogRef,
              private alertServiceService: AlertServiceService) {
    this.cols = [
      {field: 'pac_nombre', header: 'Paciente',   width: '70%'  },
      { field: 'pac_sexo', header: 'Sexo' ,  width: '10%' },
      { field: 'pac_dni', header: 'DNI' ,  width: '20%' },
      { field: '', header: '',  width: '6%' },
   ];
  }

  ngOnInit() {
  }


buscar() {
  if ((this.busqueda != undefined) && ( this.busqueda.length >= 3)) {
  this.getPacienteByDni();
  } else {
      this.alertServiceService.throwAlert('warning', 'error', 'La busqueda debe tener mas de tres caracteres', '100');
  }
}

getPacienteByDni() {
  try {
    this.loading = true;

    this.matriculaService.getPacienteByCondicion(this.textoBusqueda , this.busqueda )
    .subscribe(resp => {
      if (resp[0]) {

      this.elementos = resp;
      console.log(this.elementos);
    } else {

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

agregarPaciente(){
  const data: any = null;
  const ref = this.dialogService.open(PacienteEditarComponent, {
    data,
     header: 'Agregar paciente',
     width: '98%',
     height: '90%'
    });
  ref.onClose.subscribe((PacienteEditarComponent: any) => {
       if (PacienteEditarComponent) {
       console.log(PacienteEditarComponent);
       }
    });
}

confirmar(elemento: any) {
  this.ref.close(elemento);

}
}
