import { calendarioIdioma } from 'src/app/config/config';
import { AlertServiceService } from './../../../../services/alert-service.service';
import { MatriculaService } from './../../../../services/matricula.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-paciente-editar',
  templateUrl: './paciente-editar.component.html',
  styleUrls: ['./paciente-editar.component.scss']
})
export class PacienteEditarComponent implements OnInit {

  es: any;
  unidad: string;
  es_nuevo = false;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  selectedCategory: any = null;
  updateDataForm: FormGroup;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private matriculaService: MatriculaService, private alertServiceService: AlertServiceService) {

    this.updateDataForm = new FormGroup({
      'id_paciente': new FormControl(''),
      'pac_nombre': new FormControl('', Validators.required),
      'pac_dni': new FormControl('', Validators.required),
      'pac_sexo': new FormControl('FEMENINO', Validators.required),
      'pac_diagnostico': new FormControl('-'),
      'nro_afiliado': new FormControl(),
  });
  }

  ngOnInit() {

    this.es = calendarioIdioma;
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.config.data);
    if (this.config.data) {
      console.log('es editable');
      this.updateDataForm.patchValue(this.config.data);
      this.es_nuevo = false;
    } else {
      this.es_nuevo = true;
    }
  }


  guardarDatos() {
    console.log(this.updateDataForm.value);

    if (this.es_nuevo) {

      try {
        this.loading = true;
        this.matriculaService.setPaciente(this.updateDataForm.value)
        .subscribe(resp => {
          console.log(resp);
          this.loading = false;
          swal({
            toast: false,
            type: 'success',
            text: 'Se creo el paciente ' + this.updateDataForm.value.pac_nombre + ' ' + this.updateDataForm.value.pac_dni,
            title: 'PACIENTE CREADO',
            showConfirmButton: false,
            timer: 2000,
            onClose: () => {
              this.ref.close(resp);
            }
          });

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



    } else {
      try {
        this.loading = true;
        this.matriculaService.putPaciente(this.updateDataForm.value, this.config.data.id_paciente)
        .subscribe(resp => {
          console.log(resp);
          this.loading = false;
          swal({
            toast: false,
            type: 'success',
            text: 'Se modifico el paciente ' + this.updateDataForm.value.pac_nombre + ' ' + this.updateDataForm.value.pac_dni,
            title: 'PACIENTE MODIFICADO',
            showConfirmButton: false,
            timer: 2000,
            onClose: () => {
              this.ref.close(resp);
            }
          });

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



  }
}
