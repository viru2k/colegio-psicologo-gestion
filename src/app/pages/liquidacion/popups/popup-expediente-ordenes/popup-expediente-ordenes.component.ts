import { ObraSocialService } from "./../../../../services/obra-social.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { LiquidacionService } from "./../../../../services/liquidacion.service";
import { Component, OnInit } from "@angular/core";
import { calendarioIdioma } from "./../../../../config/config";

@Component({
  selector: "app-popup-expediente-ordenes",
  templateUrl: "./popup-expediente-ordenes.component.html",
  styleUrls: ["./popup-expediente-ordenes.component.scss"],
})
export class PopupExpedienteOrdenesComponent implements OnInit {
  es: any;
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;
  elementoObraSocial: any[] = [];

  constructor(
    public config: DynamicDialogConfig,
    private obraSocialService: ObraSocialService,
    private liquidacionService: LiquidacionService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.es = calendarioIdioma;

    this.updateDataForm = new FormGroup({
      id_os_liquidacion: new FormControl(),
      id_os_obra_social: new FormControl(),
      os_liq_numero: new FormControl(),
      os_nombre: new FormControl(),
      os_fecha_desde: new FormControl(),
      os_fecha_hasta: new FormControl(),
      os_estado: new FormControl(),
      os_cant_ordenes: new FormControl(0),
      os_monto_total: new FormControl(0),
    });
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.config.data);
    this.getObraSocial();
    if (this.config.data) {
      console.log("es editable");
      this.es_nuevo = false;
      // FORMATO DE FECHA
      let _fecha: Date = new Date(this.config.data.os_fecha_desde);
      let dateFix = new Date(
        _fecha.getTime() + _fecha.getTimezoneOffset() * 60 * 1000
      );
      this.config.data.os_fecha_desde = dateFix;
      _fecha = new Date(this.config.data.os_fecha_hasta);
      dateFix = new Date(
        _fecha.getTime() + _fecha.getTimezoneOffset() * 60 * 1000
      );
      this.config.data.os_fecha_hasta = dateFix;
      this.updateDataForm.patchValue(this.config.data);
    } else {
      this.es_nuevo = true;
      console.log("es nuevo");
    }
  }

  async getObraSocial() {
    this.loading = true;
    try {
      await this.obraSocialService.getObraSocial().subscribe(
        (resp) => {
          let i = 0;
          if (resp[0]) {
            this.elementoObraSocial = resp;
            console.log(this.elementoObraSocial);
            this.updateDataForm
              .get("os_nombre")
              .setValue(
                this.elementoObraSocial.find(
                  (elem) => elem.os_nombre === this.config.data.os_nombre
                )
              );
          }
          this.loading = false;
        },
        (error) => {
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

  changeElementoObraSocial(event: any) {
    console.log(event.value);
    this.updateDataForm.patchValue({ id_os_obra_social: event.value.id });
  }

  guardarDatos() {
    console.log(this.updateDataForm);
    try {
      this.liquidacionService
        .putLiquidacion(
          this.updateDataForm.value,
          this.updateDataForm.value.id_os_liquidacion
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

  sumarDeuda() {
    let total =
      Number(this.updateDataForm.value.os_liq_bruto) -
      Number(this.updateDataForm.value.os_ing_brutos) -
      Number(this.updateDataForm.value.os_lote_hogar) -
      Number(this.updateDataForm.value.os_gasto_admin) -
      Number(this.updateDataForm.value.os_imp_cheque) -
      Number(this.updateDataForm.value.os_desc_matricula) -
      Number(this.updateDataForm.value.os_desc_fondo_sol) -
      Number(this.updateDataForm.value.os_otros_ing_eg);
    this.updateDataForm.patchValue({ os_liq_neto: total });
  }
}
