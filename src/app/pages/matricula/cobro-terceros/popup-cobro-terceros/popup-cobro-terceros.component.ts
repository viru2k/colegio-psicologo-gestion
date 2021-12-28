import {
  DynamicDialogConfig,
  MessageService,
  DynamicDialogRef,
  DialogService,
} from "primeng/api";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { DatePipe, formatDate, CurrencyPipe } from "@angular/common";
import { calendarioIdioma } from "./../../../../config/config";
import swal from "sweetalert2";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import { MovimientoCajaService } from "./../../../../services/movimiento-caja.service";

@Component({
  selector: "app-popup-cobro-terceros",
  templateUrl: "./popup-cobro-terceros.component.html",
  styleUrls: ["./popup-cobro-terceros.component.scss"],
  providers: [MessageService, DialogService],
})
export class PopupCobroTercerosComponent implements OnInit {
  esEditar = false;
  loading = false;
  es: any;
  formasPago: any[];
  updateDataForm: FormGroup;
  forma_pago: string;
  _fechaHoy: string;
  selectedForma: string;

  elementoConceptoCuenta: any[] = [];
  elementoCuenta: any[] = [];
  elementoTipoComprobante: any[] = [];
  elementoMoneda: any[] = [];

  constructor(
    public config: DynamicDialogConfig,
    private movimientoCajaService: MovimientoCajaService,
    private alertServiceService: AlertServiceService,
    private messageService: MessageService,
    public ref: DynamicDialogRef,
    public dialogService: DialogService,
    private cp: CurrencyPipe
  ) {
    this.es = calendarioIdioma;

    this.updateDataForm = new FormGroup({
      id: new FormControl(),
      fecha_carga: new FormControl(new Date()),
      comprobante_numero: new FormControl(""),
      mov_concepto_cuenta_id: new FormControl(7),
      mov_cuenta_id: new FormControl(1),
      concepto_cuenta: new FormControl("VARIOS"),
      descripcion: new FormControl(""),
      mov_tipo_comprobante_id: new FormControl(11),
      tipo_comprobante: new FormControl("RECIBO INGRESO"),
      cuenta_nombre: new FormControl("PESOS"),
      tiene_enlace_factura: new FormControl("NO"),
      mov_tipo_moneda_id: new FormControl(1),
      tipo_moneda: new FormControl("PESOS"),
      importe: new FormControl(0),
      cotizacion: new FormControl(1),
      total: new FormControl(0),
      liq_liquidacion_distribucion_id: new FormControl(0),
      factura_encabezado_id: new FormControl(0),
      paciente_id: new FormControl(0),
      nombreyapellido_paciente: new FormControl(""),
      nombreyapellido_proveedor: new FormControl(""),
      proveedor_registro_nombre: new FormControl(""),
    });

    console.log(this.config.data);
    if (this.config.data) {
      let _fecha: Date = new Date(this.config.data.fecha_carga);
      let dateFix = new Date(
        _fecha.getTime() + _fecha.getTimezoneOffset() * 60 * 1000
      );
      console.log(new Date().getFullYear() - new Date(dateFix).getFullYear());
      console.log(dateFix);
      this.config.data.fecha_carga = dateFix;
      if (this.config.data.es_cierre) {
        this.esEditar = false;
      } else {
        this.esEditar = true;
      }

      this.updateDataForm.patchValue(this.config.data);
      this.updateDataForm.patchValue({
        fecha_carga: new Date(this.config.data.fecha_carga),
      });
      console.log(this.updateDataForm.value);
    }
  }

  ngOnInit() {
    this.getMovimientoConceptoCuentas();
    this.getCuentas();
    this.getTipoComprobante();
    this.getMoneda();
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

  async getMovimientoConceptoCuentas() {
    try {
      await this.movimientoCajaService.getMovimientoConceptoCuentas().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementoConceptoCuenta = resp;
            console.log(this.elementoConceptoCuenta);
            if (this.esEditar) {
              // tslint:disable-next-line: max-line-length
              this.updateDataForm
                .get("concepto_cuenta")
                .setValue(
                  this.elementoConceptoCuenta.find(
                    (elem) =>
                      elem.concepto_cuenta === this.config.data.concepto_cuenta
                  )
                );
            } else {
              this.updateDataForm
                .get("concepto_cuenta")
                .setValue(
                  this.elementoConceptoCuenta.find(
                    (elem) => elem.concepto_cuenta === "VARIOS"
                  )
                );
            }
          }
          this.loading = false;
        },
        (error) => {
          console.log(error.message);
          console.log(error.status);
          // tslint:disable-next-line: max-line-length
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            error.message,
            error.status
          );
        }
      );
    } catch (error) {
      // tslint:disable-next-line: max-line-length
      this.alertServiceService.throwAlert(
        "error",
        "Error: " + error.status + "  Error al cargar los registros",
        error.message,
        error.status
      );
    }
  }

  changeElementoConceptoCuenta(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_concepto_cuenta_id: event.value.id });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   CUENTA                                   */
  /* -------------------------------------------------------------------------- */

  async getCuentas() {
    try {
      await this.movimientoCajaService.getMovimientoCuentas().subscribe(
        (resp) => {
          let i = 0;
          let _resp: any[] = [];
          if (resp[0]) {
            resp.forEach((element) => {
              if (element.movimiento_tipo === "INGRESO") {
                _resp.push(element);
              }
            });
            this.elementoCuenta = _resp;
            this.updateDataForm
              .get("cuenta_nombre")
              .setValue(
                this.elementoCuenta.find(
                  (elem) => elem.cuenta_nombre === "PESOS"
                )
              );
            console.log(this.elementoCuenta);
            //si no es nuevo le agrego el valor
            if (this.esEditar) {
              this.updateDataForm
                .get("cuenta_nombre")
                .setValue(
                  this.elementoCuenta.find(
                    (elem) =>
                      elem.cuenta_nombre === this.config.data.cuenta_nombre
                  )
                );
            }
          }
          this.loading = false;
        },
        (error) => {
          console.log(error.message);
          console.log(error.status);
          // tslint:disable-next-line: max-line-length
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

  changeElementoCuenta(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_cuenta_id: event.value.id });
  }

  /* -------------------------------------------------------------------------- */
  /*                              TIPO  COMPROBANTE                             */
  /* -------------------------------------------------------------------------- */

  async getTipoComprobante() {
    try {
      await this.movimientoCajaService
        .getMovimientoConceptoTipoComprobantes()
        .subscribe(
          (resp) => {
            if (resp[0]) {
              this.elementoTipoComprobante = resp;
              console.log(this.elementoTipoComprobante);
              if (this.esEditar) {
                // tslint:disable-next-line: max-line-length
                this.updateDataForm
                  .get("tipo_comprobante")
                  .setValue(
                    this.elementoTipoComprobante.find(
                      (elem) =>
                        elem.tipo_comprobante ===
                        this.config.data.tipo_comprobante
                    )
                  );
              } else {
                this.updateDataForm
                  .get("tipo_comprobante")
                  .setValue(
                    this.elementoTipoComprobante.find(
                      (elem) => elem.tipo_comprobante === "RECIBO INGRESO"
                    )
                  );
              }
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

  changeElementoTipoComprobante(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_tipo_comprobante_id: event.value.id });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   MONEDA                                   */
  /* -------------------------------------------------------------------------- */

  async getMoneda() {
    try {
      await this.movimientoCajaService.getMovimientoConceptoMonedas().subscribe(
        (resp) => {
          if (resp[0]) {
            this.elementoMoneda = resp;
            console.log(this.elementoMoneda);
            if (this.esEditar) {
              this.updateDataForm
                .get("tipo_moneda")
                .setValue(
                  this.elementoMoneda.find(
                    (elem) => elem.tipo_moneda === this.config.data.tipo_moneda
                  )
                );
            } else {
              this.updateDataForm
                .get("tipo_moneda")
                .setValue(
                  this.elementoMoneda.find(
                    (elem) => elem.tipo_moneda === "PESOS"
                  )
                );
            }
          }
          this.loading = false;
        },
        (error) => {
          console.log(error.message);
          console.log(error.status);
          // tslint:disable-next-line: max-line-length
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

  changeElementoMoneda(event) {
    console.log(event.value);
    this.updateDataForm.patchValue({ mov_tipo_moneda_id: event.value.id });
  }

  actualizarDatos() {
    console.log(this.updateDataForm.value);
    if (this.esEditar) {
      try {
        this.movimientoCajaService
          .putMovimientoCajav2(this.updateDataForm.value, this.config.data.id)
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
    } else {
      try {
        this.movimientoCajaService
          .setMovimientoCajav2(this.updateDataForm.value)
          .subscribe(
            (resp) => {
              this.alertServiceService.throwAlert(
                "success",
                "Se creó el registro con éxito",
                "",
                ""
              );
              this.ref.close();
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
}
