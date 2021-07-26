import { Component, OnInit } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";
import { ObraSocialService } from "../../../../services/obra-social.service";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-popup-convenio-editar",
  templateUrl: "./popup-convenio-editar.component.html",
  styleUrls: ["./popup-convenio-editar.component.scss"],
})
export class PopupConvenioEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  elementoSesionTipo: any[] = [];
  elementoObraSocial: any[] = [];

  constructor(
    public config: DynamicDialogConfig,
    private obraSocialService: ObraSocialService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      id: new FormControl(),
      id_precio: new FormControl(0),
      id_sesion: new FormControl(),
      id_sesion_tipo: new FormControl(),
      os_nombre: new FormControl(""),
      os_sesion: new FormControl(""),
      os_sesion_anual: new FormControl(0),
      os_sesion_codigo: new FormControl(0),
      os_sesion_mes: new FormControl(0),
      es_habilitada: new FormControl("S", Validators.required),
    });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    if (this.config.data) {
      console.log("es editable");
      this.es_nuevo = false;
      this.updateDataForm.patchValue(this.config.data);
    } else {
      this.es_nuevo = true;
      console.log("es nuevo");
    }

    this.getSesionTipo();
    this.getObraSocial();
  }

  getSesionTipo() {
    this.loading = true;
    try {
      this.obraSocialService.getSesionTipo().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementoSesionTipo = resp;
            if (!!this.config.data) {
              this.updateDataForm
                .get("os_sesion")
                .setValue(
                  this.elementoSesionTipo.find(
                    (elem) => elem.os_sesion === this.config.data.os_sesion
                  )
                );
            }
            console.log(this.elementoSesionTipo);
          } else {
            this.elementoSesionTipo = null;
          }
          this.loading = false;
          console.log(resp);
        },
        (error) => {
          // error path
          console.log(error);

          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }
  getObraSocial() {
    this.loading = true;
    try {
      this.obraSocialService.getObraSocial().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementoObraSocial = resp;
            console.log(this.elementoObraSocial);
            if (!!this.config.data) {
              this.updateDataForm
                .get("os_nombre")
                .setValue(
                  this.elementoObraSocial.find(
                    (elem) => elem.os_nombre === this.config.data.os_nombre
                  )
                );
            }
          } else {
            this.elementoObraSocial = null;
          }
          this.loading = false;
          console.log(resp);
        },
        (error) => {
          // error path
          console.log(error);

          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  changeElementoObraSocial(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_concepto_cuenta_id: event.value.id });
  }

  changeElementoSesionTipo(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({
      id_sesion_tipo: event.value.id_sesion_tipo,
    });
    //this.updateDataForm.patchValue({ os_sesion: event.value.os_sesion });
    this.updateDataForm.patchValue({
      os_sesion_codigo: event.value.os_sesion_codigo,
    });
  }

  guardarDatos() {
    if (this.es_nuevo) {
      this.nueva();
    } else {
      this.editar();
    }
  }

  nueva() {
    this.loading = true;
    console.log(this.updateDataForm);

    try {
      this.obraSocialService.setConvenio(this.updateDataForm.value).subscribe(
        (resp) => {
          this.loading = false;
          console.log(resp);
          this.ref.close(resp);
        },
        (error) => {
          // error path
          console.log(error);
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            "",
            "500"
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }

  editar() {
    console.log(this.updateDataForm);
    try {
      this.obraSocialService
        .putConvenio(
          this.updateDataForm.value,
          this.updateDataForm.value.id_sesion
        )
        .subscribe(
          (resp) => {
            this.loading = false;
            console.log(resp);
            this.ref.close(resp);
          },
          (error) => {
            // error path
            console.log(error);
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              "",
              "500"
            );
          }
        );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        "",
        "500"
      );
    }
  }
}
