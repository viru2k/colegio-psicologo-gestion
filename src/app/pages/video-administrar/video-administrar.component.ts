import { Component, OnInit } from "@angular/core";

import { DialogService, MessageService } from "primeng/api";

import { URL_ARCHIVO } from "./../../config/config";
import { PopupVideoComponent } from "./popup-video/popup-video.component";
import { AlertServiceService } from "./../../services/alert-service.service";
import { TurnoService } from "../../services/turno.service";
import { take } from "rxjs/operators";

@Component({
  selector: "app-video-administrar",
  templateUrl: "./video-administrar.component.html",
  styleUrls: ["./video-administrar.component.scss"],
})
export class VideoAdministrarComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any = [];
  types: any[];
  selectedType: string = "privado";
  loading;
  ruta_archivo = "";

  constructor(
    private turnoService: TurnoService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService
  ) {
    this.ruta_archivo = URL_ARCHIVO;
    this.types = [
      { label: "publico", value: "publico" },
      { label: "privado", value: "privado" },
    ];
  }

  ngOnInit() {
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.turnoService
        .getMultimedia(this.selectedType)
        .pipe(take(1))
        .subscribe(
          (resp) => {
            resp.forEach((element) => {
              element.ruta = URL_ARCHIVO;
            });
            this.elementos = resp;
            console.log(this.elementos);
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

  guardarOrden() {
    console.log(this.selecteditems);
    console.log(this.elementos);
    let i = 0;
    this.elementos.forEach((element) => {
      element.orden = i;
      i++;
    });
  }

  buscar(elemento: any) {
    console.log(this.selecteditems);
    console.log(elemento);

    const data: any = elemento;
    const ref = this.dialogService.open(PopupVideoComponent, {
      data,
      header: "Editar archivo multimedia",
      width: "80%",
      height: "90%",
    });

    // tslint:disable-next-line: no-shadowed-variable
    ref.onClose.subscribe((PopupVideoComponent: any) => {
      if (PopupVideoComponent) {
        this.loadlist();
      }
    });
  }

  nuevo() {
    const data: string = this.selectedType;
    const ref = this.dialogService.open(PopupVideoComponent, {
      data,
      header: "Subir archivo multimedia",
      width: "80%",
      height: "90%",
    });

    // tslint:disable-next-line: no-shadowed-variable
    ref.onClose.subscribe((PopupVideoComponent: any) => {
      this.loadlist();
    });
  }

  /*   editar() {
    let elemento: any[] = [];

    elemento["es_nuevo"] = "SI";

    elemento["orden_total"] = this.elementos.length;

    const data: any = elemento;
    const ref = this.dialogService.open(PopupVideoComponent, {
      data,
      header: "Subir archivo multimedia",
      width: "80%",
      height: "90%",
    });

    // tslint:disable-next-line: no-shadowed-variable
    ref.onClose.subscribe((PopupVideoComponent: any) => {
      if (PopupVideoComponent) {
        console.log("nuevo");
        this.loadlist();
      }
    });
  } */

  eliminar(event) {
    this.loading = true;
    try {
      this.turnoService.delMultimedia(event.id, this.selectedType).subscribe(
        (resp) => {
          this.loadlist();
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
}
