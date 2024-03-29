import { Component, OnInit } from "@angular/core";
import { AlertServiceService } from "./../../../../services/alert-service.service";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/api";
import { CobroService } from "./../../../../services/cobro.service";
import swal from "sweetalert2";
import { Filter } from "./../../../../shared/filter";
import { calendarioIdioma } from "../../../../config/config";
import { PopupLiquidacionExpedienteEditarComponent } from "./../../popups/popup-liquidacion-expediente-editar/popup-liquidacion-expediente-editar.component";
import { LiquidacionService } from "./../../../../services/liquidacion.service";
import { formatDate } from "@angular/common";
import { PopupLiquidacionLiquidacionesComponent } from "./../../popups/popup-liquidacion-liquidaciones/popup-liquidacion-liquidaciones.component";
import { OverlayPanel } from "primeng/overlaypanel";
import { PopupLiquidacionExpedienteDetalleComponent } from "../../popups/popup-liquidacion-expediente-detalle/popup-liquidacion-expediente-detalle.component";
import { PopupExpedienteOrdenesComponent } from "../../popups/popup-expediente-ordenes/popup-expediente-ordenes.component";

@Component({
  selector: "app-liquidar-expediente",
  templateUrl: "./liquidar-expediente.component.html",
  styleUrls: ["./liquidar-expediente.component.scss"],
})
export class LiquidarExpedienteComponent implements OnInit {
  _os_liq_numero: any[] = [];
  _os_nombre: any[] = [];
  elementos: any[] = [];
  conceptoSeleccionado: any = [];
  elementosFiltrados: any[] = [];
  cols: any[];
  es: any;
  display: boolean;
  loading = false;
  elemento: any[] = null;
  selecteditem: any = null;
  selecteditems: any[] = [];
  userData: any;
  total = 0;
  ordenes = 0;
  liquidacionNumero = 0;
  fechaDesde: Date;
  _os_fecha: string;
  os_fecha: Date;

  id_liquidacion = 0;

  constructor(
    private liquidacionService: LiquidacionService,
    public dialogService: DialogService,
    private alertServiceService: AlertServiceService,
    private filter: Filter
  ) {
    this.cols = [
      { field: "boton", header: "", width: "6%" },
      { field: "id_os_liquidacion", header: "ID", width: "10%" },
      { field: "os_nombre", header: "Obra social", width: "26%" },
      { field: "os_liq_numero", header: "Liquidación", width: "8%" },
      { field: "os_fecha_desde", header: "Desde", width: "12%" },
      { field: "os_fecha_hasta", header: "Hasta", width: "12%" },
      { field: "os_cant_ordenes", header: "Ordenes", width: "12%" },
      { field: "os_monto_total", header: "Total", width: "12%" },
      { field: "os_estado", header: "Estado", width: "8%" },
      { field: "id_liquidacion", header: "Liq. ID", width: "8%" },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.os_fecha = new Date();

    this.loadExpediente();
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
    this.sumarTotal(this.elementosFiltrados);
  }

  actualizarFechaDesde(event) {
    console.log(event);
    this.fechaDesde = event;
    console.log(new Date(this.os_fecha));
  }

  loadExpediente() {
    this.loading = true;
    try {
      this.liquidacionService.getExpedienteByEstado("G").subscribe(
        (resp) => {
          this.elementos = resp;
          this.realizarFiltroBusqueda(this.elementos);
          //   this.sumarTotal(this.elementos);
          this.loading = false;
        },
        (error) => {
          // error path
          this.loading = false;
          console.log(error.message);
          console.log(error.status);
          this.alertServiceService.throwAlert(
            "error",
            "Error: " + error.status + "  Error al cargar los registros",
            error.message,
            ""
          );
        }
      );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error al cargar los registros",
        error,
        " "
      );
    }
  }

  getExpedienteByIdLiquidacion() {
    this.loading = true;
    try {
      this.liquidacionService
        .getExpedienteByIdLIquidacion(String(this.id_liquidacion))
        .subscribe(
          (resp) => {
            this.elementos = resp;
            this.realizarFiltroBusqueda(this.elementos);
            //   this.sumarTotal(this.elementos);
            this.loading = false;
          },
          (error) => {
            // error path
            this.loading = false;
            console.log(error.message);
            console.log(error.status);
            this.alertServiceService.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              error.message,
              ""
            );
          }
        );
    } catch (error) {
      this.alertServiceService.throwAlert(
        "error",
        "Error al cargar los registros",
        error,
        " "
      );
    }
  }

  BuscarExpedientesLiquidacion() {
    const data: any = event;

    const ref = this.dialogService.open(
      PopupLiquidacionLiquidacionesComponent,
      {
        data,
        header: "Liquidaciones confeccionadas",
        width: "60%",
        height: "95%",
      }
    );

    ref.onClose.subscribe((PopupLiquidacionLiquidacionesComponent: any) => {
      if (PopupLiquidacionLiquidacionesComponent) {
        console.log(PopupLiquidacionLiquidacionesComponent);
        this.id_liquidacion =
          PopupLiquidacionLiquidacionesComponent.id_liquidacion_generada;
        this.getExpedienteByIdLiquidacion();
      }
    });
  }

  sumarTotal(_elementos) {
    console.log(_elementos);
    this.total = 0;
    this.ordenes = 0;
    let i = 0;
    for (i = 0; i < _elementos.length; i++) {
      console.log(_elementos);
      this.total = this.total + Number(_elementos[i].os_monto_total);
      this.ordenes = this.ordenes + Number(_elementos[i].os_cant_ordenes);
    }
  }

  sumarValores(vals: any) {
    let i: number;
    console.log(vals);
    //console.log(vals[1]['valor_facturado']);
    console.log(vals !== undefined);
    this.ordenes = 0;
    this.total = 0;

    for (i = 0; i < vals.length; i++) {
      this.total = this.total + Number(vals[i]["os_monto_total"]);
      this.ordenes = this.ordenes + Number(vals[i]["os_cant_ordenes"]);
    }
  }

  detalle(evt: any, overlaypanel: OverlayPanel, event: any) {
    console.log(event);
    this.selecteditem = event;
    overlaypanel.toggle(evt);
  }

  editarRegistro(event) {
    const data: any = this.selecteditem;

    const ref = this.dialogService.open(PopupExpedienteOrdenesComponent, {
      data,
      header: "Editar orden",
      width: "98%",
      height: "95%",
    });

    ref.onClose.subscribe((data: any) => {
      if (!!data) {
        this.loadExpediente();
      }
    });
  }

  detalleOrdenes(event) {
    const data: any = this.selecteditem;

    const ref = this.dialogService.open(
      PopupLiquidacionExpedienteDetalleComponent,
      {
        data,
        header: "Detalle del  expediente",
        width: "98%",
        height: "95%",
      }
    );

    ref.onClose.subscribe((data: any) => {
      if (!!data) {
        this.loadExpediente();
      }
    });
  }

  actualizarValores(event) {
    swal({
      title: "¿Desea actualizar los valores para este expediente?",
      text: "Modificar registros",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, actualizar!",
    }).then((result) => {
      if (result.value) {
        console.log(this.selecteditem);
        this.loading = true;
        try {
          this.liquidacionService
            .putActualizarValoresExpediente(this.selecteditem.id_os_liquidacion)
            .subscribe(
              (resp) => {
                if (resp[0]) {
                  console.log(resp);
                }
                this.loading = false;
              },
              (error) => {
                // error path
                this.loading = false;
                console.log(error.message);
                console.log(error.status);
                this.alertServiceService.throwAlert(
                  "error",
                  "Error: " + error.status + "  Error al cargar los registros",
                  error.message,
                  ""
                );
              }
            );
        } catch (error) {
          this.alertServiceService.throwAlert(
            "error",
            "Error al cargar los registros",
            error,
            " "
          );
        }
      }
    });
  }

  generarLiquidacion() {
    swal({
      title: "¿Generar liquidación?",
      text: "Acciones de expediente",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, generar liquidación!",
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        try {
          this.liquidacionService
            .generarLiquidacion(
              this.liquidacionNumero,
              formatDate(this.os_fecha, "yyyy-MM-dd", "en"),
              this.selecteditems
            )
            .subscribe(
              (resp) => {
                if (resp[0]) {
                  this.elemento = resp;
                  this.alertServiceService.throwAlert(
                    "success",
                    "Liquidación confeccionada",
                    "EXITO AL CONFECCIONAR LA LIQUIDACION",
                    "200"
                  );
                  this.loadExpediente();
                }
                this.loading = false;
              },
              (error) => {
                // error path
                this.loading = false;
                console.log(error.message);
                console.log(error.status);
                this.alertServiceService.throwAlert(
                  "error",
                  "Error: " + error.status + "  Error al cargar los registros",
                  error.message,
                  ""
                );
              }
            );
        } catch (error) {
          this.alertServiceService.throwAlert(
            "error",
            "Error al cargar los registros",
            error,
            " "
          );
        }
      }
    });
  }

  calcularBruto() {
    swal({
      title: "¿Calcular bruto?",
      text: "Acciones de expediente",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, calcular!",
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        try {
          this.liquidacionService
            .calcularBruto(String(this.id_liquidacion))
            .subscribe(
              (resp) => {
                if (resp[0]) {
                  this.elemento = resp;
                  this.alertServiceService.throwAlert(
                    "success",
                    "Liquidación confeccionada",
                    "EXITO AL CONFECCIONAR LA LIQUIDACION",
                    "200"
                  );
                }
                this.loading = false;
              },
              (error) => {
                // error path
                this.loading = false;
                console.log(error.message);
                console.log(error.status);
                this.alertServiceService.throwAlert(
                  "error",
                  "Error: " + error.status + "  Error al cargar los registros",
                  error.message,
                  ""
                );
              }
            );
        } catch (error) {
          this.alertServiceService.throwAlert(
            "error",
            "Error al cargar los registros",
            error,
            " "
          );
        }
      }
    });
  }

  /** ACCIONES */

  colorRow(estado: string) {
    if (estado == "INGRESO") {
      return { "es-ingreso": "null" };
    }

    if (estado == "EGRESO") {
      return { "es-egreso": "null" };
    }
  }

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA

    this._os_liq_numero = [];
    this._os_nombre = [];

    resp.forEach((element) => {
      this._os_liq_numero.push(element["os_liq_numero"]);
      this._os_nombre.push(element["os_nombre"]);

      /** SUMO LO FILTRADO */
    });

    // ELIMINO DUPLICADOS
    this._os_liq_numero = this.filter.filterArray(this._os_liq_numero);
    this._os_nombre = this.filter.filterArray(this._os_nombre);
  }

  colorString(estado: string) {
    if (estado === "P" || estado === null) {
      return { "es-ingreso": "null" };
    } else {
      return { "es-egreso": "null" };
    }
  }
}
