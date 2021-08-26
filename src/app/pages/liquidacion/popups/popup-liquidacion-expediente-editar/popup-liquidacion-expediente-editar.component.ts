import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/api";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { LiquidacionService } from "./../../../../services/liquidacion.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-popup-liquidacion-expediente-editar",
  templateUrl: "./popup-liquidacion-expediente-editar.component.html",
  styleUrls: ["./popup-liquidacion-expediente-editar.component.scss"],
})
export class PopupLiquidacionExpedienteEditarComponent implements OnInit {
  updateDataForm: FormGroup;
  elementos: any;
  unidades: any;
  unidad: string;
  es_nuevo;
  loading;
  selectedItem: any;
  selectedForma: any;
  userData: any;

  constructor(
    public config: DynamicDialogConfig,
    private liquidacionService: LiquidacionService,
    private alertServiceService: AlertServiceService,
    public ref: DynamicDialogRef
  ) {
    this.updateDataForm = new FormGroup({
      id_liquidacion_detalle: new FormControl(),
      os_liq_bruto: new FormControl(0),
      os_ing_brutos: new FormControl(0),
      os_lote_hogar: new FormControl(0),
      os_gasto_admin: new FormControl(0),
      os_imp_cheque: new FormControl(0),
      os_desc_matricula: new FormControl(0),
      os_desc_fondo_sol: new FormControl(0),
      os_otros_ing_eg: new FormControl(0),
      os_descuentos: new FormControl(0),
      os_liq_neto: new FormControl(0),
      os_num_ing_bruto: new FormControl(0),
      num_comprobante: new FormControl(0),
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
  }

  guardarDatos() {
    console.log(this.updateDataForm);
    try {
      this.liquidacionService
        .putLiquidacionDetalle(
          this.updateDataForm.value,
          this.updateDataForm.value.id_liquidacion_detalle
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
