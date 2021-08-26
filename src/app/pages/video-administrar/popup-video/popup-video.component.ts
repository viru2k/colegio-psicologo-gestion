import { AlertServiceService } from "./../../../services/alert-service.service";
import {
  DynamicDialogConfig,
  MessageService,
  DynamicDialogRef,
  DialogService,
} from "primeng/api";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { TurnoService } from "../../../../../../turnos-llamador/src/app/services/turno.service";
import { calendarioIdioma } from "src/app/config/config";

@Component({
  selector: "app-popup-video",
  templateUrl: "./popup-video.component.html",
  styleUrls: ["./popup-video.component.scss"],
})
export class PopupVideoComponent implements OnInit {
  esEditar = false;
  loading = false;
  es: any;
  formasPago: any[];
  updateDataForm: FormGroup;
  forma_pago: string;
  _fechaHoy: string;
  selectedPagina: string;
  estado: "ACTIVO";
  elementoTipo: any[] = [];
  elementoPagina: any[] = [];
  elementoTipoComprobante: any[] = [];
  elementoMoneda: any[] = [];

  constructor(
    public config: DynamicDialogConfig,
    private turnoService: TurnoService,
    private alertServiceService: AlertServiceService,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public dialogService: DialogService
  ) {
    this.es = calendarioIdioma;

    this.elementoTipo = [
      { name: "DOCUMENTO", code: "DOCUMENTO" },
      { name: "ENLACE", code: "ENLACE" },
      { name: "IMAGEN", code: "IMAGEN" },
      { name: "TEXTO", code: "TEXTO" },
      { name: "VIDEO", code: "VIDEO" },
      { name: "YOUTUBE", code: "YOUTUBE" },
    ];

    this.elementoPagina = [
      { pagina: "ASUNTOSPROFESIONALES", code: "ASUNTOSPROFESIONALES" },
      { pagina: "INCIO", code: "INCIO" },
      { pagina: "REVISORES", code: "REVISORES" },
      { pagina: "SECRETARIAGENERAL", code: "SECRETARIAGENERAL" },
      { pagina: "SOCIAL", code: "SOCIAL" },
      { pagina: "TESORERIA", code: "TESORERIA" },
    ];

    this.updateDataForm = new FormGroup({
      descripcion: new FormControl(),
      enlace: new FormControl(""),
      enlace_video: new FormControl(null),
      enlace_video_youtube: new FormControl(null),
      es_curso: new FormControl("NO"),
      es_importante: new FormControl("NO"),
      es_video: new FormControl("NO"),
      es_youtube: new FormControl("NO"),
      estado: new FormControl("ACTIVO"), // debe concatenarsecon movimiento tipo 'movimiento_tipo': new FormControl(),
      fecha_creacion: new FormControl(new Date()),
      id: new FormControl(),
      imagen: new FormControl(""),
      pagina: new FormControl("INICIO"),
      ruta: new FormControl(""),
      tiene_enlace: new FormControl("NO"),
      tiene_imagen: new FormControl("NO"),
      titulo: new FormControl(""),
      updated_at: new FormControl(new Date()),
    });

    console.log(this.config.data);
    if (!!this.config.data) {
      let _fecha: Date = new Date(this.config.data.fecha_creacion);
      let dateFix = new Date(
        _fecha.getTime() + _fecha.getTimezoneOffset() * 60 * 1000
      );
      console.log(new Date().getFullYear() - new Date(dateFix).getFullYear());
      console.log(dateFix);
      this.config.data.fecha_creacion = dateFix;
      if (this.config.data.es_cierre) {
        this.esEditar = false;
      } else {
        this.esEditar = true;
      }

      this.updateDataForm.patchValue(this.config.data);
      this.updateDataForm.patchValue({
        fecha_creacion: new Date(this.config.data.fecha_creacion),
      });
      console.log(this.updateDataForm.value);
    }
  }

  ngOnInit() {
    this.getPagina();
  }

  buscarFactura() {}

  calcularTotal() {
    this.updateDataForm.patchValue({
      total:
        this.updateDataForm.value.importe *
        this.updateDataForm.value.cotizacion,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                             CONCEPTO DE CUENTA                             */
  /* -------------------------------------------------------------------------- */

  changeElementoPagina(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_concepto_cuenta_id: event.value.id });
  }

  changeElementoTipoDocumento(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_tipo_comprobante_id: event.value.id });
  }

  actualizarDatos() {
    console.log(this.updateDataForm.value);
    if (this.esEditar) {
      try {
        this.turnoService.UploadFileDatos(this.updateDataForm.value).subscribe(
          (resp) => {
            this.alertServiceService.throwAlert(
              "success",
              "Se modificó el registro con éxito",
              "",
              ""
            );
            this.ref.close(resp);
          },
          (error) => {
            // error path
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              error.message,
              error.status
            );
          }
        );
      } catch (error) {
        this.alertServiceService.throwAlert(
          "error",
          "Error: " + error.status + "  Error al cargar los registros",
          error.message,
          error.status
        );
      }
    }
  }

  async getPagina() {
    this.updateDataForm
      .get("pagina")
      .setValue(
        this.elementoPagina.find(
          (elem) => elem.pagina === this.config.data.pagina
        )
      );
  }
}
