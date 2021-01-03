import { PacienteEditarComponent } from './paciente-editar/paciente-editar.component';
import { MatriculaService } from './../../../services/matricula.service';
import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng/api';

import { FormGroup } from '@angular/forms';
import { calendarioIdioma } from './../../../config/config';
import { ObraSocialService } from '../../../services/obra-social.service';
import { AlertServiceService } from './../../../services/alert-service.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(private matriculaService: MatriculaService, private alertServiceService: AlertServiceService,  public dialogService: DialogService, private messageService: MessageService) {

    this.cols = [

      { field: 'pac_nombre', header: 'Paciente',  width: '30%' },
      { field: 'pac_dni', header: 'DNI',  width: '16%' },
      { field: 'pac_sexo', header: 'Sexo',  width: '12%' },
      { field: 'nro_afiliado', header: 'Nº afiliado',  width: '16%' },
      { field: 'pac_diagnostico', header: 'Diagnostico',  width: '30%' },
      { field: '', header: 'Acción',  width: '6%' }

   ];
  }

  ngOnInit() {
    console.log('cargando insumo');
    this.loadlist();
  }

  loadlist() {

    this.loading = true;
    try {
        this.matriculaService.getPacientes()
        .subscribe(resp => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
              }else{
                this.elementos =null;
              }
            this.loading = false;
            console.log(resp);
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

  const ref = this.dialogService.open(PacienteEditarComponent, {
  data,
   header: 'Editar paciente',
   width: '60%',
   height: '100%'
  });

  ref.onClose.subscribe((PacienteEditarComponent: any) => {
    if (PacienteEditarComponent){
      this.loadlist();
    }
  });

}


nuevo() {

  const data: any = null;

  const ref = this.dialogService.open(PacienteEditarComponent, {
  data,
   header: 'Crear paciente',
   width: '60%',
   height: '100%'
  });

  ref.onClose.subscribe((PacienteEditarComponent: any) => {

    if (PacienteEditarComponent) {
      this.loadlist();
    }
  });

}
}
