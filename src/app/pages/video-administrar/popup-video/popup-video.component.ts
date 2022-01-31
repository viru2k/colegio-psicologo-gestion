import { TurnoService } from "./../../../services/turno.service";
import { AlertServiceService } from "./../../../services/alert-service.service";
import {
  DynamicDialogConfig,
  MessageService,
  DynamicDialogRef,
  DialogService,
} from "primeng/api";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { calendarioIdioma } from "src/app/config/config";
import { take } from "rxjs/operators";

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

  estado: "ACTIVO";
  elementoTipo: any[] = [];
  elementoPagina: any[] = [];
  selectedPagina = "INICIO";

  texto: boolean = true;
  video: boolean = false;
  imagen: boolean = false;
  documento: boolean = false;
  youtube: boolean = false;
  file_data: any;

  constructor(
    public config: DynamicDialogConfig,
    private turnoService: TurnoService,
    private alertServiceService: AlertServiceService,
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
      { pagina: "ASUNTOS PROFESIONALES", code: "ASUNTOSPROFESIONALES" },
      { pagina: "INICIO", code: "INICIO" },
      { pagina: "REVISORES", code: "REVISORES" },
      { pagina: "SECRETARIA GENERAL", code: "SECRETARIAGENERAL" },
      { pagina: "SOCIAL", code: "SOCIAL" },
      { pagina: "TESORERIA", code: "TESORERIA" },
    ];

    this.updateDataForm = new FormGroup({
      descripcion: new FormControl(),
      enlace_video: new FormControl(null),
      enlace_video_youtube: new FormControl(null),
      es_curso: new FormControl("NO"), // no se usa mas
      es_video: new FormControl("NO"),
      es_youtube: new FormControl("NO"),
      tiene_imagen: new FormControl("NO"),
      imagen: new FormControl(""),
      tiene_enlace: new FormControl("NO"),
      enlace: new FormControl(""),
      es_importante: new FormControl("NO"),
      estado: new FormControl("ACTIVO"),
      fecha_creacion: new FormControl(new Date()),
      id: new FormControl(),
      pagina: new FormControl("INICIO"),
      code: new FormControl("INICIO"),
      ruta: new FormControl(""),
      titulo: new FormControl(""),
      updated_at: new FormControl(new Date()),
      file_data: new FormControl(""),
    });

    /*  if (!!this.config.data) {
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
    } */
  }

  ngOnInit() {
    console.log(this.config.data);
    //this.getPagina();
    this.updateDataForm.patchValue({ code: "INICIO" });
  }

  handleChangeVideo(e) {
    let isChecked = e.checked;
    if (this.video) {
      console.log("video");

      this.imagen = false;
      this.documento = false;
      this.texto = false;
      this.youtube = false;
      this.updateDataForm.patchValue({ es_video: "SI" });
      this.updateDataForm.patchValue({ es_youtube: "NO" });
      this.updateDataForm.patchValue({ tiene_imagen: "NO" });
      this.updateDataForm.patchValue({ tiene_enlace: "NO" });
    }
  }
  handleChangeImagen(e) {
    this.video = false;
    this.documento = false;
    this.texto = false;
    this.youtube = false;
    this.updateDataForm.patchValue({ es_video: "NO" });
    this.updateDataForm.patchValue({ es_youtube: "NO" });
    this.updateDataForm.patchValue({ tiene_imagen: "SI" });
    this.updateDataForm.patchValue({ tiene_enlace: "NO" });
  }
  handleChangeDocumento(e) {
    this.video = false;
    this.imagen = false;
    this.documento = true;
    this.texto = false;
    this.youtube = false;
    this.updateDataForm.patchValue({ es_video: "NO" });
    this.updateDataForm.patchValue({ es_youtube: "NO" });
    this.updateDataForm.patchValue({ tiene_imagen: "NO" });
    this.updateDataForm.patchValue({ tiene_enlace: "SI" });
  }
  handleChangeTexto(e) {
    this.video = false;
    this.imagen = false;
    this.documento = false;
    this.youtube = false;
    this.updateDataForm.patchValue({ es_video: "NO" });
    this.updateDataForm.patchValue({ es_youtube: "NO" });
    this.updateDataForm.patchValue({ tiene_imagen: "NO" });
    this.updateDataForm.patchValue({ tiene_enlace: "NO" });
  }
  handleChangeYotube(e) {
    this.video = false;
    this.imagen = false;
    this.documento = false;
    this.texto = false;
    this.updateDataForm.patchValue({ es_video: "NO" });
    this.updateDataForm.patchValue({ es_youtube: "SI" });
    this.updateDataForm.patchValue({ tiene_imagen: "NO" });
    this.updateDataForm.patchValue({ tiene_enlace: "NO" });
  }

  /* -------------------------------------------------------------------------- */
  /*                             GESTION DE ARCHIVOS                          */
  /* -------------------------------------------------------------------------- */

  changeElementoPagina(event): void {
    this.updateDataForm.patchValue({ pagina: event.value.code });
  }

  fileChange(event): void {
    let file_data_image = event.target.files[0];
    //get file information such as name, size and type
    //max file size is 4 mb
    if (file_data_image.size / 1048576 <= 20) {
      var myFormData = new FormData();

      myFormData.append("file_data", file_data_image);
      this.file_data = myFormData;
      this.updateDataForm.patchValue({ file_data: file_data_image.name });
    } else {
      this.alertServiceService.throwAlert(
        "warning",
        "Atención: " + " El tamaño del archivo es mayor a 20 Mb",
        "",
        "Interno"
      );
    }
  }

  getDestino(): string {
    if (this.documento) {
      return "documentos";
    }

    if (this.video) {
      return "videos";
    }

    if (this.imagen) {
      return "imagenes";
    }
  }

  actualizarDatos(): void {
    if (this.texto) {
      this.actualizarDatosBody();
    } else {
      this.actualizarDatosFile();
    }
  }

  actualizarDatosFile() {
    console.log(this.updateDataForm.value);

    try {
      this.turnoService
        .uploadNoticia(this.file_data, this.getDestino())
        .pipe(take(1))
        .subscribe(
          (resp) => {
            this.actualizarDatosBody();
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

  actualizarDatosBody() {
    this.updateDataForm.patchValue({ ruta: this.config.data });
    console.log(this.updateDataForm.value);
    console.log(this.file_data);
    try {
      this.turnoService
        .uploadNoticiaBody(this.updateDataForm.value)
        .pipe(take(1))
        .subscribe(
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

  /* 
  getPagina() {
    this.updateDataForm
      .get("pagina")
      .setValue(
        this.elementoPagina.find(
          (elem) => elem.pagina === this.config.data.pagina
        )
      );
  } */
}
