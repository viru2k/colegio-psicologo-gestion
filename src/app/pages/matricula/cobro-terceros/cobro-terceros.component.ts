import { ReciboEncabezadoCaja } from "./../../../models/recibo-encabezado-caja-model";
import { FacturacionService } from "./../../../services/facturacion.service";
import { ReciboElectronicoCaja } from "./../../../models/recibo-electronica-caja.model";
import { ReciboElectronico } from "./../../../models/recibo-electronico.model";
import { DialogService, MessageService } from "primeng/api";
import { formatDate, DatePipe, CurrencyPipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import swal from "sweetalert2";
import { OverlayPanelModule, OverlayPanel } from "primeng/overlaypanel";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { PopupCobroTercerosComponent } from "./popup-cobro-terceros/popup-cobro-terceros.component";
import { MovimientoCajaService } from "./../../../services/movimiento-caja.service";
import { calendarioIdioma } from "./../../../config/config";
import { ExcelService } from "./../../../services/excel.service";
import { Filter } from "./../../../shared/filter";

import { PopupRealizarFacturaComponent } from "./../../../shared/popups/popup-realizar-factura/popup-realizar-factura.component";
import { AlertServiceService } from "../../../services/alert-service.service";

declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");

@Component({
  selector: "app-cobro-terceros",
  templateUrl: "./cobro-terceros.component.html",
  styleUrls: ["./cobro-terceros.component.scss"],
})
export class CobroTercerosComponent implements OnInit {
  cols: any[];
  colsRecibo: any[];
  es: any;
  display: boolean;
  observacion: string;
  // LOADING
  DateForm: FormGroup;
  DateForm1: FormGroup;
  loading: boolean;
  elemento: any[] = null;
  selecteditems: any[] = [];
  elementosFiltrados: any[] = [];
  elementosFiltradosImpresion: any[] = [];
  columns: any;
  userData: any;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;

  total_ingreso = 0;
  total_egreso = 0;
  saldo = 0;

  _cuenta_nombre: any[] = [];
  _tipo_comprobante: any[] = [];
  _concepto_cuenta: any[] = [];
  _movimiento_tipo: any[] = [];
  _tipo_moneda: any[] = [];
  elementosPtoVta: any[] = null;
  elementoPtoVta: number = null;
  pto_vta: string = "0";
  _pto_vta: string = "0";

  constructor(
    private movimientoCajaService: MovimientoCajaService,
    private messageService: MessageService,
    private alertServiceService: AlertServiceService,
    public dialogService: DialogService,
    private route: ActivatedRoute,
    private excelService: ExcelService,
    private router: Router,
    private filter: Filter,
    private cp: CurrencyPipe,
    private facturacionService: FacturacionService
  ) {
    this.cols = [
      { field: "boton", header: "", width: "6%" },
      { field: "boton", header: "", width: "6%" },
      { field: "fecha_carga", header: "Fecha", width: "10%" },
      { field: "cuenta_nombre", header: "Cuenta", width: "16%" },
      { field: "tipo_comprobante", header: "Comprobante", width: "12%" },
      { field: "concepto_cuenta", header: "Concepto", width: "16%" },
      { field: "proveedor_registro_nombre", header: "A nombre", width: "20%" },
      { field: "comprobante_numero", header: "Número", width: "10%" },
      { field: "descripcion", header: "Descripción", width: "20%" },
      { field: "movimiento_tipo", header: "Tipo", width: "10%" },
      { field: "tipo_moneda", header: "Moneda", width: "10%" },
      { field: "total", header: "Total", width: "10%" },
    ];

    this.colsRecibo = [
      { title: "Concepto", dataKey: "concepto_cuenta" },
      { title: "Descripcion", dataKey: "descripcion" },
      { title: "Total", dataKey: "total" },
    ];
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;

    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.obtenerPerfilCobro();
  }

  obtenerPerfilCobro() {
    try {
      this.loading = true;
      this.facturacionService.getDatoMedico(this.userData["id"]).subscribe(
        (resp) => {
          this.loading = false;
          console.log(resp);
          console.log(resp[0]["pto_vta_id"]);
          this.pto_vta = resp[0]["pto_vta_id"];
          this.loadMovimientoRegistro();
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

  crearFactura(element: any) {
    console.log(element);
    if (element) {
      if (element.proveedor_nombre === null) {
        element.proveedor_nombre = "";
      }
      element.psicologo = element.proveedor_nombre;
      element.tipo_cobro = "CAJA";
      const data: any = element;
      const ref = this.dialogService.open(PopupRealizarFacturaComponent, {
        data,
        header: "Realizar factura",
        width: "98%",
        height: "98%",
      });

      ref.onClose.subscribe((PopupRealizarFacturaComponent: any) => {
        if (PopupRealizarFacturaComponent) {
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
  realizarCobro(elemento: any): void {
    const renglon = new ReciboElectronicoCaja(
      elemento["descripcion"],
      elemento["total"]
    );

    const recibo = new ReciboEncabezadoCaja(
      this.pto_vta,
      elemento["proveedor_cuit"],
      elemento["proveedor_nombre"],
      formatDate(elemento["fecha_carga"], "yyyy-MM-dd", "en"),

      elemento["total"],
      this.userData["id"],
      elemento["cuenta_nombre"],
      elemento["movimiento_tipo"],
      renglon,
      elemento["id"]
    );

    console.log(recibo);
    this.facturacionService.crearCajaCobro(recibo).subscribe((response) => {
      this.loadMovimientoRegistro();
      swal({
        type: "success",
        title: "Exito",
        text: "Registro generado",
      });
    });
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

    const ref = this.dialogService.open(PopupCobroTercerosComponent, {
      data,
      header: "Registrar movimiento",
      width: "98%",
      height: "95%",
    });

    ref.onClose.subscribe((PopupCobroTercerosComponent: any) => {
      if (PopupCobroTercerosComponent) {
        this.loadMovimientoRegistro();
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
      seleccionados["fecha_carga"] = formatDate(
        element["fecha_carga"],
        "dd/MM/yyyy",
        "es-Ar"
      );
      seleccionados["cuenta_nombre"] = element.cuenta_nombre;
      seleccionados["tipo_comprobante"] = element.tipo_comprobante;
      seleccionados["concepto_cuenta"] = element.concepto_cuenta;
      seleccionados["proveedor_nombre"] = element.proveedor_nombre;
      seleccionados["comprobante_numero"] = element.comprobante_numero;
      seleccionados["descripcion"] = element.descripcion;
      seleccionados["movimiento_tipo"] = element.movimiento_tipo;
      seleccionados["tipo_moneda"] = element.tipo_moneda;
      seleccionados["cantidad"] = element.importe;
      seleccionados["cotizacion"] = element.cotizacion;

      seleccionados["total"] = element.total;
      // exportar.push(seleccionados);
      exportar[i] = seleccionados;
      //  console.log(element);
      // console.log(seleccionados);
      seleccionados = [];
      i++;
    });
    this.excelService.exportAsExcelFile(
      exportar,
      "listado_presentacion_detallado" + fecha_impresion
    );
  }

  editarRegistro(event) {
    event.es_cierre = false;
    const data: any = event;

    const ref = this.dialogService.open(PopupCobroTercerosComponent, {
      data,
      header: "Editar ingreso",
      width: "98%",
      height: "95%",
    });

    ref.onClose.subscribe((PopupCobroTercerosComponent: any) => {
      if (PopupCobroTercerosComponent) {
        this.loadMovimientoRegistro();
      }
    });
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
    this.sumarValores(this.elementosFiltrados);
  }

  loadMovimientoRegistro() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.es = calendarioIdioma;
    this.loading = true;
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd HH:mm", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd HH:mm", "en");
    console.log(userData["id"]);

    try {
      this.movimientoCajaService
        .geRegistroMovimientoBydatev2(this._fechaDesde, this._fechaHasta)
        .subscribe(
          (resp) => {
            if (resp[0]) {
              resp.forEach((element) => {
                element.nombreyapellido_paciente = element.proveedor_nombre;
              });
              this.realizarFiltroBusqueda(resp);

              this.elemento = resp;
              console.log(resp);
              this.sumarValores(resp);
            }
            this.loading = false;
          },
          (error) => {
            // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert(
              "error",
              "Error: " + error.status + "  Error al cargar los registros",
              error.message
            );
          }
        );
    } catch (error) {
      this.throwAlert("error", "Error al cargar los registros", error);
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

  verDetalle(agendaTurno: any) {
    /*
  console.log(agendaTurno);
  let liquidacion:Liquidacion;
  liquidacion = new Liquidacion(agendaTurno['operacion_cobro_id'],'','','','','','',0,0,'','',[],'','','',0);
  let data:any;
  data = liquidacion;
  const ref = this.dialogService.open(PopupOperacionCobroDetalleComponent, {
  data,
   header: 'Ver detalle de presentación',
   width: '98%',
   height: '100%'
  });

  ref.onClose.subscribe((PopupOperacionCobroDetalleComponent:any) => {

  });
   */
  }

  generarPdf() {
    /*
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en');
  console.log(this.elementos);
  if(!this.elementosFiltrados){
    this.elementosFiltradosImpresion = this.agendaTurno;
  }else{
    this.elementosFiltradosImpresion = this.elementosFiltrados;
  }
  let fecha = formatDate(this.fechaHoy, 'dd/MM/yyyy', 'en');
  var doc = new jsPDF('landscape');


  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
  doc.setLineWidth(0.4);
  doc.line(10, 30, pageWidth - 10, 30);
  doc.setFontSize(12);
  doc.text('Agenda de pacientes', pageWidth/2, 20, null, null, 'center');
  doc.text('Emitido : '+_fechaEmision, pageWidth/2, 24, null, null, 'center');
  doc.setFontSize(8);
  doc.text(pageWidth-60, 20, 'Agenda del dia :' + fecha);


   doc.autoTable(this.columns, this.elementosFiltradosImpresion,
      {
        margin: {horizontal: 5, vertical: 35},
        bodyStyles: {valign: 'top'},
        styles: {fontSize: 7,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify'},
        columnStyles: {text: {cellWidth: 'auto'}}
      }
      );
      window.open(doc.output('bloburl')); */
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

  sumarValores(vals: any) {
    let i: number;
    console.log(vals);
    this.total_egreso = 0;
    this.total_ingreso = 0;
    this.saldo = 0;
    vals.forEach((element) => {
      console.log(element.movimiento_tipo);
      if (element.movimiento_tipo === "INGRESO") {
        this.total_ingreso = this.total_ingreso + Number(element.total);
      }
      if (element.movimiento_tipo === "EGRESO") {
        this.total_egreso = this.total_egreso + Number(element.total);
      }
      this.saldo = this.total_ingreso - this.total_egreso;
    });
  }

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._cuenta_nombre = [];
    this._tipo_comprobante = [];
    this._concepto_cuenta = [];
    this._movimiento_tipo = [];
    this._tipo_moneda = [];

    resp.forEach((element) => {
      this._cuenta_nombre.push(element["cuenta_nombre"]);
      this._tipo_comprobante.push(element["tipo_comprobante"]);
      this._concepto_cuenta.push(element["concepto_cuenta"]);
      this._movimiento_tipo.push(element["movimiento_tipo"]);
      this._tipo_moneda.push(element["tipo_moneda"]);
    });

    // ELIMINO DUPLICADOS
    this._cuenta_nombre = this.filter.filterArray(this._cuenta_nombre);
    this._tipo_comprobante = this.filter.filterArray(this._tipo_comprobante);
    this._concepto_cuenta = this.filter.filterArray(this._concepto_cuenta);
    this._movimiento_tipo = this.filter.filterArray(this._movimiento_tipo);
    this._tipo_moneda = this.filter.filterArray(this._tipo_moneda);
  }

  generarPDFCobro(datosRecibo: any) {
    // GENERO EL FORMATO DE LOS COBROS

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
    doc.text("IVA EXENTO", 15, 39);
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
    doc.text(
      datosRecibo["tipo_comprobante"] + ": " + datosRecibo["factura_numero"],
      pageWidth / 2 + 10,
      18
    );
    doc.setFontStyle("normal");
    doc.setFontSize(9);

    doc.setFontStyle("normal");
    doc.setFontSize(9);
    doc.text(
      "Fecha Emisión: " +
        formatDate(datosRecibo["fecha_carga"], "dd/MM/yyyy", "en"),
      pageWidth / 2 + 10,
      28
    );
    doc.text(
      "A nombre: " + datosRecibo["proveedor_registro_nombre"],
      pageWidth / 2 + 10,
      34
    );
    doc.setFontSize(8);
    doc.text(
      "Forma pago: " + datosRecibo["cuenta_nombre"],
      pageWidth / 2 + 10,
      40
    );
    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text(
      "Total: " +
        this.cp.transform(datosRecibo["total"], "", "symbol-narrow", "1.2-2"),
      pageWidth / 2 + 10,
      46
    );

    doc.setLineWidth(0.4);

    /* -------------------------------------------------------------------------- */
    /*                             DATOS DE LA FACTURA                            */
    /* -------------------------------------------------------------------------- */

    doc.setFontSize(10);

    doc.setFontStyle("normal");
    console.log(datosRecibo);
    let documentoPdf: any[] = [];
    documentoPdf.push(datosRecibo);
    doc.autoTable(this.colsRecibo, documentoPdf, {
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
        concepto_cuenta: { columnWidth: 70 },
        descripcion: { columnWidth: 90 },
        total: { columnWidth: 20 },
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
    this.loadMovimientoRegistro();
  }

  colorString(estado: string) {
    if (estado === "INGRESO" || estado === null) {
      return { "es-ingreso": "null" };
    } else {
      return { "es-egreso": "null" };
    }
  }

  throwAlert(estado: string, mensaje: string, motivo: string) {
    if (estado == "success") {
      swal({
        type: "success",
        title: "Exito",
        text: mensaje,
      });
    }
    if (estado == "error") {
      swal({
        type: "error",
        title: "Oops...",
        text: mensaje,
        footer: motivo,
      });
    }
  }
}
