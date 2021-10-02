import { ReciboEncabezado } from "./../../../models/recibo-encabezado.model";
import { DialogService, MessageService } from "primeng/api";
import { formatDate, DatePipe, CurrencyPipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import swal from "sweetalert2";
import { OverlayPanelModule, OverlayPanel } from "primeng/overlaypanel";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { PopupMovimientoComponent } from "./../../movimiento-caja/popup-movimiento/popup-movimiento.component";

import { CobroService } from "../../../services/cobro.service";
import { FacturacionService } from "./../../../services/facturacion.service";
import { PopupFindMatriculaComponent } from "./../../../shared/popups/popup-find-matricula/popup-find-matricula.component";

import { PopupRealizarFacturaComponent } from "./../../../shared/popups/popup-realizar-factura/popup-realizar-factura.component";
import { PopupConceptoAgregarComponent } from "./popups/popup-concepto-agregar/popup-concepto-agregar.component";

import { calendarioIdioma } from "./../../../config/config";
import { ExcelService } from "./../../../services/excel.service";
import { Filter } from "./../../../shared/filter";
import { AlertServiceService } from "../../../services/alert-service.service";
import { PopupConceptoEditarComponent } from "./popups/popup-concepto-editar/popup-concepto-editar.component";
import { PopupConceptoPlanPagoComponent } from "./popups/popup-concepto-plan-pago/popup-concepto-plan-pago.component";
import { ReciboElectronico } from "../../../models/recibo-electronico.model";

declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");

@Component({
  selector: "app-matricula-cobro",
  templateUrl: "./matricula-cobro.component.html",
  styleUrls: ["./matricula-cobro.component.scss"],
})
export class MatriculaCobroComponent implements OnInit {
  cols: any[];
  colsRecibo: any[];
  es: any;
  display: boolean;
  observacion: string;
  // LOADING
  DateForm: FormGroup;
  DateForm1: FormGroup;
  loading = false;
  elemento: any[] = null;
  selecteditem: any = null;
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  elementosPDF: any[] = [];
  columns: any;
  userData: any;
  hoy: Date;
  fecha: Date;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;

  total_ingreso = 0;
  total_egreso = 0;
  saldo = 0;
  matricula: string;
  estado: string;
  psicologo: any = null;
  _mat_concepto: any[] = [];
  _mat_num_cuota: any[] = [];
  _mat_estado: any[] = [];
  _nombreyapellido: any[] = [];
  _mat_tipo_pago: any[] = [];
  pago: any[];
  total = 0;
  total_pagado = 0;
  total_seleccionado = 0;
  selectedPago: any;

  reciboEncabezado: ReciboEncabezado;
  elementosPtoVta: any[] = null;
  elementoPtoVta: number = null;
  pto_vta: string = "0";
  _pto_vta: string = "0";
  elementoComprobante: string = null;
  recibo_registros: ReciboElectronico[] = [];

  constructor(
    private cobroService: CobroService,
    private facturacionService: FacturacionService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private alertServiceService: AlertServiceService,
    private excelService: ExcelService,
    private router: Router,
    private filter: Filter,
    private cp: CurrencyPipe
  ) {
    this.pago = [
      { name: "Contado", code: "C" },
      { name: "Tarjeta credito", code: "T" },
      { name: "Tarjeta debito", code: "D" },
      { name: "Transferencia", code: "B" },
    ];

    this.cols = [
      { field: "boton", header: "", width: "6%" },
      { field: "mat_matricula", header: "Mat.", width: "8%" },
      { field: "mat_nombreyapellido", header: "Psicólogo", width: "20%" },
      { field: "mat_concepto", header: "Concepto", width: "20%" },
      { field: "mat_descripcion", header: "Descripción", width: "25%" },
      { field: "mat_monto", header: "Valor", width: "12%" },
      { field: "mat_monto_final", header: "Importe", width: "12%" },
      { field: "mat_fecha_pago", header: "F. Pago", width: "12%" },
      { field: "mat_fecha_vencimiento", header: "F. Venc", width: "12%" },
      { field: "mat_num_cuota", header: "Cuota", width: "8%" },
      { field: "mat_id_plan", header: "Plan", width: "8%" },
      { field: "mat_estado", header: "Estado", width: "8%" },
      { field: "mat_tipo_pago", header: "Tipo", width: "8%" },
      { field: "id_liquidacion_detalle", header: "N°", width: "8%" },
      { field: "nombreyapellido", header: "Usuario", width: "14%" },
    ];

    this.colsRecibo = [
      { title: "Concepto", dataKey: "mat_concepto" },
      { title: "Plan", dataKey: "mat_id_plan" },
      { title: "Vencimiento", dataKey: "mat_fecha_vencimiento" },
      { title: "Cuota", dataKey: "mat_num_cuota" },
      { title: "Descripción", dataKey: "mat_descripcion" },
      { title: "Importe", dataKey: "mat_monto_final" },
    ];

    this.columns = [
      { title: "Matrícula", dataKey: "mat_matricula" },
      { title: "Psicólogo", dataKey: "mat_nombreyapellido" },
      { title: "Concepto", dataKey: "mat_concepto" },
      { title: "Descripción", dataKey: "mat_descripcion" },
      { title: "Valor", dataKey: "mat_monto" },
      { title: "Importe", dataKey: "mat_monto_final" },
      { title: "Vencimiento", dataKey: "mat_fecha_vencimiento" },
      { title: "Cuota", dataKey: "mat_num_cuota" },
      { title: "Plan", dataKey: "mat_id_plan" },
      { title: "Estado", dataKey: "mat_estado" },
      { title: "Punto", dataKey: "id_usuario" },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.hoy = new Date();
    this.fecha = new Date();
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.selectedPago = this.pago[0];
    this.PtoVta();
  }

  PtoVta() {
    this.loading = true;

    try {
      this.facturacionService.PtoVta().subscribe(
        (resp) => {
          let i: number = 0;
          let resultado = resp;
          resultado.forEach((element) => {
            resp[i]["punto_vta"] = this.padLeft(resp[i]["punto_vta"], "0", 4);
            i++;
          });
          this.elementosPtoVta = resp;
          this.loading = false;
          console.log(resp);
          this.obtenerPerfilCobro();
        },
        (error) => {
          // error path
          this.loading = false;
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: "error",
            text: error.message,
            title: "error.status",
            showConfirmButton: false,
            timer: 2000,
          });
        }
      );
    } catch (error) {}
  }
  obtenerPerfilCobro() {
    try {
      this.loading = true;
      this.facturacionService.getDatoMedico(this.userData["id"]).subscribe(
        (resp) => {
          this.loading = false;
          console.log(resp);

          this.elementoPtoVta = this.elementosPtoVta.find(
            (x) => x.id == resp[0]["punto_vta"]
          );
          this.pto_vta = this.elementoPtoVta["punto_vta"];
          console.log(resp[0]["punto_vta"]);

          /* -------------------------------------------------------------------------- */
          /*                           OBTENGO EL COMPROBANTE                           */
          /* -------------------------------------------------------------------------- */
          this.elementoComprobante = "MATRICULA";
        },
        (error) => {
          // error path
          this.loading = false;
          console.log(error);
          console.log(error.status);
          swal({
            toast: false,
            type: "error",
            text: error,
            title: "Algo no esta bien....",
            showConfirmButton: true,
          });
        }
      );
    } catch (error) {}
  }

  obtenerPuntoVta() {
    console.log(this.elementoPtoVta);
    this._pto_vta = this.elementoPtoVta["id"];
    this.pto_vta = this.padLeft(this.elementoPtoVta["punto_vta"], "0", 4);
    console.log(this.pto_vta);
    //this.obtenerUltimaFactura();
  }

  changeElementoPago(event) {
    console.log(event.value);
    this.selectedPago = event.value;
  }

  exportarExcel() {
    let result = this.elementosFiltrados as any;
    if (this.selecteditems.length > 0) {
    } else {
      swal({
        title: "TURNOS NO SELECCIONADOS",
        text: "Debe seleccionar al menos un turno",
        type: "warning",
        showConfirmButton: false,
        timer: 4000,
      });
    }
  }

  nuevo() {
    const data: any = null;

    const ref = this.dialogService.open(PopupMovimientoComponent, {
      data,
      header: "Agregar ingreso",
      width: "98%",
      height: "95%",
    });

    ref.onClose.subscribe((PopupMovimientoComponent: any) => {
      if (PopupMovimientoComponent) {
        //this.loadMovimientoRegistro();
      }
    });
  }

  public exportarExcelDetallado() {
    const fecha_impresion = formatDate(new Date(), "dd-MM-yyyy-mm", "es-Ar");
    let seleccionados: any[] = [];
    let exportar: any[] = [];
    let i = 0;
    this.selecteditems.forEach((element) => {
      // console.log(element['operacion_cobro_id']);
      seleccionados["mat_matricula"] = element.mat_matricula;
      seleccionados["mat_nombreyapellido"] = element.mat_nombreyapellido;
      seleccionados["mat_num_cuota"] = element.mat_num_cuota;
      seleccionados["mat_fecha_pago"] = formatDate(
        element["mat_fecha_pago"],
        "dd/MM/yyyy",
        "es-Ar"
      );
      seleccionados["mat_fecha_vencimiento"] = formatDate(
        element["mat_fecha_vencimiento"],
        "dd/MM/yyyy",
        "es-Ar"
      );
      seleccionados["mat_concepto"] = element.mat_concepto;
      seleccionados["mat_descripcion"] = element.mat_descripcion;
      seleccionados["mat_id_plan"] = element.mat_id_plan;
      seleccionados["mat_monto"] = element.mat_monto;
      seleccionados["id_pago_historico"] = element.id_pago_historico;
      seleccionados["mat_estado"] = element.mat_estado;
      seleccionados["id_usuario"] = element.id_usuario;

      // exportar.push(seleccionados);
      exportar[i] = seleccionados;
      //  console.log(element);
      // console.log(seleccionados);
      seleccionados = [];
      i++;
    });
    this.excelService.exportAsExcelFile(
      exportar,
      "listado_pagos" + fecha_impresion
    );
  }

  editarRegistro(event) {
    const data: any = this.selecteditem;

    const ref = this.dialogService.open(PopupConceptoEditarComponent, {
      data,
      header: "Editar concepto",
      width: "98%",
      height: "95%",
    });

    ref.onClose.subscribe((PopupConceptoEditarComponent: any) => {
      if (PopupConceptoEditarComponent) {
        this.getDeudaByMatricula(this.psicologo.mat_matricula_psicologo);
        //this.loadMovimientoRegistro();
      }
    });
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
    this.sumarValoresSeleccionados(this.elementosFiltrados);
  }

  agregarConcepto() {
    if (this.psicologo) {
      let data: any = this.psicologo;
      const ref = this.dialogService.open(PopupConceptoAgregarComponent, {
        data,
        header: "Agregar concepto",
        width: "98%",
        height: "100%",
      });

      ref.onClose.subscribe((PopupConceptoAgregarComponent: any) => {
        if (PopupConceptoAgregarComponent) {
          console.log(PopupConceptoAgregarComponent);
          this.getDeudaByMatricula(this.psicologo.mat_matricula_psicologo);
        }
      });
    } else {
      swal({
        title: "PSICOLOGO  NO SELECCIONADO",
        text: "Debe buscar buscar al menos un psicologo",
        type: "warning",
        showConfirmButton: false,
        timer: 4000,
      });
    }
  }

  agregarPlanPago() {
    if (this.psicologo) {
      let data: any = this.selecteditems;
      data["forma_pago"] = this.selectedPago.code;
      const ref = this.dialogService.open(PopupConceptoPlanPagoComponent, {
        data,
        header: "Agregar plan de pago",
        width: "98%",
        height: "100%",
      });

      ref.onClose.subscribe((PopupConceptoPlanPagoComponent: any) => {
        if (PopupConceptoPlanPagoComponent) {
          console.log(PopupConceptoPlanPagoComponent);
          this.getDeudaByMatricula(this.psicologo.mat_matricula_psicologo);
        }
      });
    } else {
      swal({
        title: "PSICOLOGO  NO SELECCIONADO",
        text: "Debe buscar buscar al menos un psicologo",
        type: "warning",
        showConfirmButton: false,
        timer: 4000,
      });
    }
  }

  realizarFactura() {
    console.log(this.selecteditems.length);
    if (this.selecteditems.length > 0) {
      this.selecteditems[0].tipo_cobro = "MATRICULA";
      this.selecteditems[0].psicologo = this.psicologo;
      let data: any = this.selecteditems;
      const ref = this.dialogService.open(PopupRealizarFacturaComponent, {
        data,
        header: "Realizar factura",
        width: "98%",
        height: "98%",
      });

      ref.onClose.subscribe((PopupRealizarFacturaComponent: any) => {
        console.log(PopupRealizarFacturaComponent);
        if (PopupRealizarFacturaComponent) {
          this.cobrarRegistros(PopupRealizarFacturaComponent);
        }
      });
    } else {
      this.loading = false;
      this.alertServiceService.throwAlert(
        "warning",
        "No se ha seleccionado ningun registro",
        "sin registros",
        "400"
      );
    }
  }

  cobrarRegistros(comprobante: string) {
    let _selectedItems: any[] = [];
    let i = 0;
    this.selecteditems.forEach((element) => {
      _selectedItems[i] = element;
      _selectedItems[i].mat_fecha_pago = formatDate(
        this.fecha,
        "yyyy-MM-dd",
        "en"
      );
      _selectedItems[i].mat_tipo_pago = this.selectedPago.code;
      _selectedItems[i].mat_estado = "P";
      _selectedItems[i].mat_numero_comprobante = comprobante;
      _selectedItems[i].id_usuario = this.userData["id"];
      _selectedItems[i].id_usuario_modifica = this.userData["id"];
      _selectedItems[i].modulo_gravado = "MATRICULA";
      i++;
    });
    try {
      this.cobroService.putRegistroCobro(_selectedItems, "1").subscribe(
        (resp) => {
          this.getDeudaByMatricula(this.psicologo.mat_matricula_psicologo);
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

  cerrarCaja() {
    let _total = 0;
    console.log(this.selecteditems.length);
    if (this.selecteditems.length > 0) {
      this.selecteditems.forEach((element) => {
        //itero por unica vez

        _total = _total + Number(element.mat_monto_final);
      });

      let data: any = [];
      data.fecha_carga = new Date();
      data.mov_cuenta_id = 1;
      data.mov_concepto_cuenta_id = 1;
      data.mov_tipo_comprobante_id = 1;
      data.mov_tipo_moneda_id = 1;
      data.total = _total;
      data.importe = _total;
      data.cantidad = 1;
      data.cotizacion = 1;
      data.descripcion = this.selecteditems[0].mat_concepto;
      data.es_cierre = true;

      const ref = this.dialogService.open(PopupMovimientoComponent, {
        data,
        header: "Cerrar caja",
        width: "98%",
        height: "95%",
      });

      ref.onClose.subscribe((PopupMovimientoComponent: any) => {
        if (PopupMovimientoComponent) {
        }
      });
    }
  }

  getDeudaByMatricula(mat_matricula_psicologo) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.loading = true;
    this.total = 0;
    this.total_pagado = 0;
    this.total_seleccionado = 0;
    console.log(userData["id"]);

    try {
      this.cobroService.getDeudaByMatricula(mat_matricula_psicologo).subscribe(
        (resp) => {
          this.elemento = [];
          this.elementosFiltrados = [];
          this.selecteditems = [];
          this.elementosFiltradosImpresion = [];
          if (resp[0]) {
            this.sumarValores(resp);
            this.realizarFiltroBusqueda(resp);

            this.elemento = resp;
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

  getDeudaByMatriculaAndEstado(mat_matricula_psicologo, estado: string) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.loading = true;
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd HH:mm", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd HH:mm", "en");
    this.total = 0;
    this.total_pagado = 0;
    this.total_seleccionado = 0;
    console.log(userData["id"]);
    try {
      this.cobroService
        .getDeudaByMatriculaAndEstado(mat_matricula_psicologo, estado)
        .subscribe(
          (resp) => {
            this.elemento = [];
            this.elementosFiltrados = [];
            this.selecteditems = [];
            this.elementosFiltradosImpresion = [];
            if (resp[0]) {
              this.sumarValores(resp);
              this.realizarFiltroBusqueda(resp);

              this.elemento = resp;
              console.log(resp);
            }
            this.loading = false;
          },
          (error) => {
            // error path
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
        ""
      );
    }
  }

  buscarCobradoEntreFechas() {
    this.loading = true;
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd HH:mm", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd HH:mm", "en");
    this.total = 0;
    this.total_pagado = 0;
    this.total_seleccionado = 0;

    try {
      this.cobroService
        .getDeudaBydMatriculaBetweenDates(
          this._fechaDesde,
          this._fechaHasta,
          "P"
        )
        .subscribe(
          (resp) => {
            this.elemento = [];
            this.elementosFiltrados = [];
            this.selecteditems = [];
            this.elementosFiltradosImpresion = [];
            if (resp[0]) {
              if (resp[0]) {
                this.sumarValores(resp);
                this.realizarFiltroBusqueda(resp);

                this.elemento = resp;
                console.log(resp);
              }
              this.realizarFiltroBusqueda(resp);

              this.elemento = resp;
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
        ""
      );
    }
  }

  buscarPendienteEntreFechas() {
    this.loading = true;
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd HH:mm", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd HH:mm", "en");
    this.total = 0;
    this.total_pagado = 0;
    this.total_seleccionado = 0;
    this.elemento = [];
    this.elementosFiltrados = [];
    this.selecteditems = [];
    this.elementosFiltradosImpresion = [];

    try {
      this.cobroService
        .getDeudaBydMatriculaBetweenDates(
          this._fechaDesde,
          this._fechaHasta,
          "A"
        )
        .subscribe(
          (resp) => {
            if (resp[0]) {
              if (resp[0]) {
                this.realizarFiltroBusqueda(resp);

                this.elemento = resp;
                console.log(resp);
              }
              this.realizarFiltroBusqueda(resp);

              this.elemento = resp;
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
        ""
      );
    }
  }

  actualizarFechaDesde(event) {
    console.log(event);
    this.fechaDesde = event;
    console.log(new Date(this.fechaDesde));
  }

  actualizarFechaHasta(event) {
    console.log(event);
    this.fechaHasta = event;
    console.log(new Date(this.fechaHasta));
  }

  actualizarFecha(event) {
    console.log(event);
    this.fecha = event;
    console.log(new Date(this.fecha));
  }

  sumarValoresSeleccionados(vals: any) {
    // SUMO LO FILTRADO
    console.log(vals);
    this.total_seleccionado = 0;
    let i: number;
    for (i = 0; i < vals.length; i++) {
      if (
        Number(
          this.filter.monthDiffByDates(
            new Date(vals[i]["mat_fecha_vencimiento"]),
            this.hoy
          )
        ) > 2
      ) {
        if (vals[i]["mat_estado"] === "A") {
          this.total_seleccionado =
            this.total_seleccionado +
            Number(vals[i]["mat_monto"]) * Number(vals[i]["mat_interes"]);
        } else {
          this.total_seleccionado =
            this.total_seleccionado + Number(vals[i]["mat_monto_cobrado"]);
        }
      } else {
        if (vals[i]["mat_estado"] === "A") {
          this.total_seleccionado =
            this.total_seleccionado + Number(vals[i]["mat_monto"]);
        } else {
          this.total_seleccionado =
            this.total_seleccionado + Number(vals[i]["mat_monto_cobrado"]);
        }
      }
    }
  }

  listarTodo() {
    let data: any;
    const ref = this.dialogService.open(PopupFindMatriculaComponent, {
      data,
      header: "Buscar matricula",
      width: "98%",
      height: "100%",
    });

    ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
      if (PopupFindMatriculaComponent) {
        console.log(PopupFindMatriculaComponent);
        this.psicologo = PopupFindMatriculaComponent;
        this.getDeudaByMatricula(
          PopupFindMatriculaComponent.mat_matricula_psicologo
        );
      }
    });
  }

  listarDeudaTotal(estado: string) {
    let data: any;
    const ref = this.dialogService.open(PopupFindMatriculaComponent, {
      data,
      header: "Buscar matricula",
      width: "98%",
      height: "100%",
    });

    ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
      if (PopupFindMatriculaComponent) {
        console.log(PopupFindMatriculaComponent);
        this.psicologo = PopupFindMatriculaComponent;
        this.getDeudaByMatriculaAndEstado(
          PopupFindMatriculaComponent.mat_matricula_psicologo,
          estado
        );
      }
    });
  }

  findMatricula() {
    let data: any;
    const ref = this.dialogService.open(PopupFindMatriculaComponent, {
      data,
      header: "Buscar matricula",
      width: "98%",
      height: "100%",
    });

    ref.onClose.subscribe((PopupFindMatriculaComponent: any) => {
      if (PopupFindMatriculaComponent) {
        console.log(PopupFindMatriculaComponent);
        this.psicologo = PopupFindMatriculaComponent;
        this.getDeudaByMatricula(
          PopupFindMatriculaComponent.mat_matricula_psicologo
        );
      }
    });
  }

  detalle(evt: any, overlaypanel: OverlayPanel, event: any) {
    console.log(event);
    this.selecteditem = event;
    overlaypanel.toggle(evt);
  }

  eliminarRegistro() {
    swal({
      title: "¿Desea eliminar el registro?",
      text: "Va a eliminar un registro",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.value) {
        const userData = JSON.parse(localStorage.getItem("userData"));
        this.es = calendarioIdioma;
        this.loading = true;
        this.total = 0;
        this.total_seleccionado = 0;
        console.log(userData["id"]);

        try {
          this.cobroService
            .putRegistroCobroEliminado(
              this.selecteditem.id_pago_historico,
              userData["id"]
            )
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

  generarPdf() {
    let _fechaEmision = formatDate(new Date(), "dd/MM/yyyy HH:mm", "en");
    console.log(this.selecteditems);
    //if (!this.selecteditems) {

    //let fecha = formatDate(this.fec, 'dd/MM/yyyy', 'en');
    var doc = new jsPDF("landscape");

    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    let img = new Image();
    img.src = "./assets/images/user-default.png";
    doc.addImage(img, "PNG", 5, 5, 18, 18, undefined, "FAST");
    doc.setFontSize(10);
    doc.text("Colegio de psicólgos", 30, 20, null, null);
    doc.text("de san juan", 30, 23, null, null);
    doc.setLineWidth(0.4);
    doc.line(10, 30, pageWidth - 10, 30);
    doc.setFontSize(12);
    doc.text("Listado de deuda", pageWidth / 2, 20, null, null, "center");
    doc.text(
      "Emitido : " + _fechaEmision,
      pageWidth / 2,
      24,
      null,
      null,
      "center"
    );
    doc.setFontSize(8);
    //doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);
    doc.autoTable(this.columns, this.selecteditems, {
      margin: { horizontal: 5, vertical: 35 },
      bodyStyles: { valign: "top" },
      styles: {
        fontSize: 7,
        cellWidth: "wrap",
        rowPageBreak: "auto",
        halign: "justify",
      },
      columnStyles: { text: { cellWidth: "auto" } },
    });
    window.open(doc.output("bloburl"));
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

  sumarValores(resp: any[]): void {
    this.total_pagado = 0;
    this.total = 0;
    let i = 0;
    for (i = 0; i < resp.length; i++) {
      if (
        Number(
          this.filter.monthDiffByDates(
            new Date(resp[i]["mat_fecha_vencimiento"]),
            this.hoy
          )
        ) > 2
      ) {
        if (resp[i]["mat_estado"] === "A") {
          resp[i]["mat_monto_final"] =
            Number(resp[i]["mat_monto"]) * Number(resp[i]["mat_interes"]);
          this.total = this.total + Number(resp[i]["mat_monto_final"]);
        } else {
          resp[i]["mat_monto_final"] = Number(resp[i]["mat_monto"]);
          this.total_pagado =
            this.total_pagado + Number(resp[i]["mat_monto_cobrado"]);
        }
      } else {
        if (resp[i]["mat_estado"] === "A") {
          resp[i]["mat_monto_final"] = Number(resp[i]["mat_monto"]);
          this.total = this.total + Number(resp[i]["mat_monto_final"]);
        } else {
          resp[i]["mat_monto_final"] = Number(resp[i]["mat_monto"]);
          this.total_pagado =
            this.total_pagado + Number(resp[i]["mat_monto_cobrado"]);
        }
      }
    }
  }

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._mat_concepto = [];
    this._mat_num_cuota = [];
    this._mat_estado = [];
    this._nombreyapellido = [];
    this._mat_tipo_pago = [];
    resp.forEach((element) => {
      this._mat_concepto.push(element["mat_concepto"]);
      this._mat_num_cuota.push(element["mat_num_cuota"]);
      this._mat_estado.push(element["mat_estado"]);
      this._nombreyapellido.push(element["nombreyapellido"]);
      this._mat_tipo_pago.push(element["mat_tipo_pago"]);
      /** SUMO LO FILTRADO */
    });

    // ELIMINO DUPLICADOS
    this._mat_concepto = this.filter.filterArray(this._mat_concepto);
    this._mat_num_cuota = this.filter.filterArray(this._mat_num_cuota);
    this._mat_estado = this.filter.filterArray(this._mat_estado);
    this._nombreyapellido = this.filter.filterArray(this._nombreyapellido);
    this._mat_tipo_pago = this.filter.filterArray(this._mat_tipo_pago);
  }

  colorString(estado: string) {
    if (estado === "P" || estado === null) {
      return { "es-ingreso": "null" };
    } else {
      return { "es-egreso": "null" };
    }
  }

  realizarCobro(): void {
    this.selecteditems.forEach((registros) => {
      const recibo = new ReciboElectronico(
        registros["id_concepto"],
        registros["id_liquidacion_detalle"],
        "",
        registros["id_pago_historico"],
        this.userData["id"],
        registros["mat_concepto"],
        registros["mat_descripcion"],
        registros["mat_estado"],
        registros["mat_fecha_pago"],
        registros["mat_fecha_vencimiento"],
        registros["mat_matricula"],
        registros["mat_nombreyapellido"],
        registros["mat_monto"],
        registros["mat_monto_final"],
        registros["mat_num_cuota"],
        registros["mat_tipo_pago"],
        registros["mat_numero_comprobante"]
      );
      this.recibo_registros.push(recibo);
    });
    //falta punto de venta
    const _reciboEncabezado = new ReciboEncabezado(
      "0",
      this.psicologo['mat_matricula_psicologo'], 
      this.psicologo['mat_apellido']+' '+ this.psicologo['mat_nombre'],
      this.total_seleccionado,
      this.selectedPago["code"],
      formatDate(this.fecha, "yyyy-MM-dd", "en"),
      this.userData["id"],
      this.recibo_registros,
      this.elementoPtoVta["id"]
    );
    console.log(_reciboEncabezado);
    /*  this.facturacionService
      .crearReciboCobro(this.reciboEncabezado)
      .subscribe(() => {
        this.generarPDFrecibo();
      }); */
  }

  /*****************************************************************************/
  /*******************************PDF RECIBO ***********************************/
  /*****************************************************************************/

  generarPDFrecibo() {
    // GENERO EL FORMATO DE LOS COBROS

    this.elementosPDF = this.selecteditems;

    var doc = new jsPDF();
    /** valores de la pagina**/
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    //borde contenedor
    doc.setLineWidth(0.3);
    doc.setDrawColor(207, 216, 220);
    doc.line(10, 10, pageWidth - 10, 10); //linea superior horizontal
    doc.line(10, 10, 10, 50); // linea vertical izquierda
    doc.line(pageWidth - 10, 10, pageWidth - 10, 50); // linea vertical derecha
    doc.line(10, 50, pageWidth - 10, 50); //linea inferior horizontal

    //borde factura letra
    doc.line(pageWidth / 2 - 6, 10, pageWidth / 2 - 6, 23); // linea vertical izquierda
    doc.line(pageWidth / 2 + 6, 10, pageWidth / 2 + 6, 23); // linea vertical derecha
    doc.line(pageWidth / 2 - 6, 23, pageWidth / 2 + 6, 23); //linea inferior horizontal

    // borde datos del clinete

    // linea divisoria
    doc.line(pageWidth / 2, 23, pageWidth / 2, 50);
    doc.setFontSize(19);
    doc.setFontStyle("bold");
    doc.text("X", pageWidth / 2 - 2.5, 17);
    doc.setFontStyle("normal");
    doc.setFontSize(6);

    let img = new Image();
    img.src = "./assets/images/user-default.png";
    doc.addImage(img, "PNG", 10, 10, 22, 22, undefined, "FAST");
    doc.setFontSize(9);

    doc.text("Colegio de Psicologos ", 33, 18);
    doc.text("de la Provincia de San Juan", 33, 22);
    doc.setFontSize(7);
    doc.text("GRAL. ACHA 1056 SUR", 15, 33);
    doc.text("5400 - SAN JUAN", 15, 36);
    doc.text("IVA EXCENTO", 15, 39);
    doc.text("C.U.I.T: 3063561825", 50, 33);
    doc.text("ING. BRUTOS: 000-039645-7", 50, 36);
    doc.text("FECHA INICIO ACT: 02/03/86", 50, 39);
    doc.setFontStyle("normal");

    doc.setFontSize(9);

    /* -------------------------------------------------------------------------- */
    /*                               DATOS DEL EMISO                              */
    /* -------------------------------------------------------------------------- */
    doc.setFontStyle("bold");
    doc.setFontSize(11);
    doc.text("RECIBO NUMERO:", pageWidth / 2 + 10, 18);
    doc.setFontStyle("normal");
    doc.setFontSize(9);

    doc.setFontStyle("normal");
    doc.setFontSize(9);
    doc.text(
      "Fecha Emisión: " + formatDate(this.fecha, "yyyy-MM-dd", "en"),
      pageWidth / 2 + 10,
      28
    );
    doc.text(
      "Matrícula: " + this.psicologo["mat_matricula_psicologo"],
      pageWidth / 2 + 10,
      32
    );
    doc.setFontSize(8);
    doc.text(
      "Psicólogo: " +
        this.psicologo["mat_apellido"] +
        " " +
        this.psicologo["mat_nombre"],
      pageWidth / 2 + 10,
      36
    );
    doc.text(
      "Método de pago: " + this.selectedPago["name"],
      pageWidth / 2 + 10,
      40
    );
    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text(
      "Total: " +
        this.cp.transform(
          this.total_seleccionado,
          "",
          "symbol-narrow",
          "1.2-2"
        ),
      pageWidth / 2 + 10,
      46
    );

    doc.setLineWidth(0.4);

    /* -------------------------------------------------------------------------- */
    /*                             DATOS DE LA FACTURA                            */
    /* -------------------------------------------------------------------------- */

    doc.setFontSize(10);

    doc.setFontStyle("normal");
    console.log(this.elementosPDF);

    doc.autoTable(this.colsRecibo, this.elementosPDF, {
      margin: { vertical: 53, right: 10, horizontal: 0 },
      bodyStyles: { valign: "top" },
      styles: {
        fontSize: 7,
        cellWidth: "wrap",
        rowPageBreak: "auto",
        halign: "justify",
        overflow: "linebreak",
      },
      columnStyles: {
        Concepto: { columnWidth: 40 },
        Plan: { columnWidth: 20 },
        Vencimiento: { columnWidth: 16 },
        Cuota: { columnWidth: 20 },
        Descripción: { columnWidth: 40 },
        Valor: { columnWidth: 30 },
      },
    });

    let pageNumber = doc.internal.getNumberOfPages();

    doc.setFontSize(8);

    const totalPagesExp = "{total_pages_count_string}";
    const footer = function (data) {
      let str = "Page " + data.pageCount;
      // Total page number plugin only available in jspdf v1.0+
      if (typeof doc.putTotalPages === "function") {
        str = str + " of " + totalPagesExp;
        console.log("test");
      }
      doc.text(
        str,
        data.settings.margin.left,
        doc.internal.pageSize.height - 30
      );
    };
    window.open(doc.output("bloburl"));
    this.limpiarDatos();
  }

  limpiarDatos() {
    this.elementosPDF = [];
    this.total = 0;
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }
}
