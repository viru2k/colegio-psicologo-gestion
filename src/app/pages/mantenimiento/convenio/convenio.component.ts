import { PopupConvenioEditarComponent } from "./../obra-social/popup-convenio-editar/popup-convenio-editar.component";
import { Component, OnInit } from "@angular/core";
import { DialogService, MessageService } from "primeng/api";

import { FormGroup } from "@angular/forms";
import { calendarioIdioma } from "./../../../config/config";
import { ObraSocialService } from "../../../services/obra-social.service";
import { AlertServiceService } from "./../../../services/alert-service.service";

@Component({
  selector: "app-convenio",
  templateUrl: "./convenio.component.html",
  styleUrls: ["./convenio.component.scss"],
})
export class ConvenioComponent implements OnInit {
  cols: any[];
  columns: any[];
  elementos: any[];
  selecteditems: any;
  loading;

  // tslint:disable-next-line: max-line-length
  constructor(
    private obraSocialService: ObraSocialService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
    this.cols = [
      { field: "os_nombre", header: "Obra social", width: "40%" },
      { field: "os_sesion", header: "Sesión", width: "26%" },
      { field: "os_sesion_codigo", header: "Código", width: "14%" },
      { field: "os_sesion_mes", header: "Mes", width: "12%" },
      { field: "os_sesion_anual", header: "Año", width: "12%" },
      { field: "id_precio", header: "Valor", width: "12%" },
      { field: "", header: "", width: "6%" },
    ];
  }

  ngOnInit() {
    console.log("cargando insumo");
    this.loadlist();
  }

  loadlist() {
    this.loading = true;
    try {
      this.obraSocialService.getConvenioHabilitada().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementos = resp;
            console.log(this.elementos);
          } else {
            this.elementos = null;
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

  buscar(elemento: any) {
    console.log(elemento);
    const data: any = elemento;

    const ref = this.dialogService.open(PopupConvenioEditarComponent, {
      data,
      header: "Editar convenio",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.loadlist();
      }
    });
  }

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(PopupConvenioEditarComponent, {
      data,
      header: "Crear convenio",
      width: "98%",
      height: "90%",
    });

    ref.onClose.subscribe((data: any) => {
      if (data) {
        this.loadlist();
      }
    });
  }
}
