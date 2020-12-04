import { ObraSocialService } from './../../../services/obra-social.service';
import { LiquidacionService } from './../../../services/liquidacion.service';
import { DialogService } from 'primeng/components/common/api';
import { PacienteEditarComponent } from './../../../pages/mantenimiento/paciente/paciente-editar/paciente-editar.component';
import { Component, OnInit } from '@angular/core';
import { MatriculaService } from '../../../services/matricula.service';
import { FormGroup } from '@angular/forms';
import { AlertServiceService } from '../../../services/alert-service.service';
import { DynamicDialogRef, MessageService } from 'primeng/api';

@Component({
  selector: 'app-popup-find-convenio',
  templateUrl: './popup-find-convenio.component.html',
  styleUrls: ['./popup-find-convenio.component.scss']
})
export class PopupFindConvenioComponent implements OnInit {


  cols: any[];

  es:any;
  // LOADING
  loading: boolean;
  elemento: any = null;
  elementos: any[] = null;
  busquedaForm:FormGroup;
  busqueda = 'apellido';
  textoBusqueda = '';

  constructor(private obraSocialService: ObraSocialService,
              private messageService: MessageService,
              public dialogService: DialogService,
              public ref: DynamicDialogRef,
              private alertServiceService: AlertServiceService) {
    this.cols = [
      {field: 'os_nombre', header: 'Obra social',   width: '30%'  },
      { field: 'id_precio', header: 'Valor' ,  width: '10%' },
      { field: 'os_sesion_codigo', header: 'PMO' ,  width: '12%' },
      { field: 'os_sesion', header: 'Sesión' ,  width: '40%' },
      { field: 'os_sesion_mes', header: 'Cant' ,  width: '12%' },
      { field: '', header: '',  width: '6%' },
   ];
  }

  ngOnInit() {
    this.getConvenio();
  }



getConvenio() {
  try {
    this.loading = true;

    this.obraSocialService.getConvenioByObraSocialHabilitada()
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
