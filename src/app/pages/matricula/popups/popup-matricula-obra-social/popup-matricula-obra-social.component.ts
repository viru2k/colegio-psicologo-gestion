import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, MessageService } from 'primeng/api';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { DialogService } from 'primeng/components/common/api';
import { ObraSocialService } from '../../../../services/obra-social.service';
import { MatriculaService } from '../../../../services/matricula.service';

@Component({
  selector: 'app-popup-matricula-obra-social',
  templateUrl: './popup-matricula-obra-social.component.html',
  styleUrls: ['./popup-matricula-obra-social.component.scss']
})
export class PopupMatriculaObraSocialComponent implements OnInit {


  cols: any[];
  columns: any[];
  elementos: any[];
  modulosUsuario: any[];
  selecteditems: any;
  loading;
  userData: any;
  selectedElemento: any;
  selectedModulos: any[];
  mensaje: string;

  // tslint:disable-next-line: max-line-length
  constructor(
    public config: DynamicDialogConfig,
    private obraSocialService: ObraSocialService,
    private matriculaService: MatriculaService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService) { }

  ngOnInit() {

    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    this.loadlist();
  }




  loadlist() {

    this.loading = true;
    this.mensaje = 'Cargando listado ...';
    try {
        this.obraSocialService.getObraSocialHabilitado()
        .subscribe(resp => {
            this.elementos = resp;
            console.log(this.elementos);
            this.loading = false;
            console.log(resp);
            this.loadlistUsuarioObraSocial();
        },
        error => { // error path
            console.log(error);
            this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
         });
    } catch (error) {
      this.alertServiceService.throwAlert('error', 'Error: ' + error.status + '  Error al cargar los registros', '', '500');
    }
}



loadlistUsuarioObraSocial() {

  this.loading = true;
  this.mensaje = 'Cargando modulos del usuario ...';
  try {
      this.matriculaService.getMatriculaObraSocial(this.config.data.id)
      .subscribe(resp => {
          this.modulosUsuario = resp;
          console.log(this.modulosUsuario);
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

borrar(e: any) {
  console.log(e.value);

  this.loading = true;
  try {
      this.matriculaService.delObraSocialMatricula(e.value.mat_matricula_obra_social_id)
      .subscribe(resp => {
          this.loadlistUsuarioObraSocial();
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

guardarModulos() {
  console.log(this.selectedModulos);

  this.loading = true;
  this.mensaje = 'Cargando modulos del usuario ...';
  try {
      this.matriculaService.setObraSocialModulo(this.selectedModulos, this.config.data.id)
      .subscribe(resp => {
          this.loadlistUsuarioObraSocial();
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
}
