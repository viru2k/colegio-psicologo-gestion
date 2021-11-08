import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  PipeTransform,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { calendarioIdioma } from "../../../config/config";
import { FacturaElectronica } from "./../../../models/factura-electronica.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import swal from "sweetalert2";

declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");
import { MessageService, SelectItem } from "primeng/api";
import { DialogService } from "primeng/components/common/api";
import { formatDate, CurrencyPipe, DecimalPipe } from "@angular/common";
import { OverlayPanelModule, OverlayPanel } from "primeng/overlaypanel";

import { FacturacionService } from "./../../../services/facturacion.service";
import { LiquidacionService } from "./../../../services/liquidacion.service";
import { FacturaElectronicaComponent } from "./../factura-electronica/factura-electronica.component";
import { Filter } from "../../../shared/filter";
import { ExcelService } from "../../../services/excel.service";

@Component({
  selector: "app-otras-acciones",
  templateUrl: "./otras-acciones.component.html",
  styleUrls: ["./otras-acciones.component.css"],
  providers: [MessageService, DialogService],
})
export class OtrasAccionesComponent implements OnInit {
  DateForm: FormGroup;
  tipo_busqueda: string = "fecha";
  columns: any[];
  columnsIva: any[];
  colsRecibo: any[];
  selecteditemRegistro: FacturaElectronica;
  selecteditems: any[] = [];
  elemento: any[] = null;
  elementosFiltrados: any[] = [];
  elementosPDF: any[] = [];
  elementosMatricula: any[] = [];
  elementosCobro: any[] = [];
  total_seleccionado = 0;
  total_sumado = 0;
  cols: any;
  fecha: Date;
  _fecha: string;
  fechaDesde: Date;
  _fechaDesde: string;
  fechaHasta: Date;
  _fechaHasta: string;
  //filters
  _descripcion: any[] = [];
  _punto_vta: any[] = [];
  _factura_numero: any[] = [];
  _factura_cliente: any[] = [];
  _factura_documento: any[] = [];
  _metodo_pago: any[] = [];
  _creado: any[] = [];

  es: any;
  loading: boolean;
  paciente_nombre: string;
  medico_id: string;
  medico_nombre: string;
  elementosMedicos: any[] = null;
  elementoMedicos: any = null;
  estado = "";
  reciboEncabezado = null;
  elementoComprobante = null;
  recibo_registros = [];
  total = 0;
  regex = "/./gi";

  // tslint:disable-next-line: max-line-length
  constructor(
    private facturacionService: FacturacionService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private cp: CurrencyPipe,
    private dp: DecimalPipe,
    private liquidacionService: LiquidacionService,
    private excelService: ExcelService,
    private filter: Filter
  ) {
    this.cols = [
      { field: "accion", header: "Accion", width: "6%" },
      { field: "descripcion", header: "Tipo Fac.", width: "8%" },
      { field: "punto_vta", header: "Pto. Vta.", width: "5%" },
      { field: "factura_numero", header: "factura nº", width: "8%" },
      { field: "fecha", header: "Fecha", width: "10%" },
      { field: "factura_cliente", header: "Cliente", width: "20%" },
      { field: "factura_documento", header: "CUIT/Mat", width: "10%" },
      { field: "importe_total", header: "Total", width: "10%" },
      { field: "metodo_pago", header: "Pago", width: "8%" },
      { field: "creado", header: "Realizo", width: "15%" },
    ];

    this.columns = [
      { title: "Descripcion", dataKey: "descripcion" },
      { title: "Cant", dataKey: "cantidad" },
      { title: "Precio unit.", dataKey: "precio_unitario" },
      { title: "Alic.", dataKey: "alicuota_descripcion" },
      { title: "Iva", dataKey: "iva" },
      { title: "Importe", dataKey: "total_renglon" },
    ];

    this.columnsIva = [
      { title: "Fecha", dataKey: "fecha" },
      { title: "Tipo", dataKey: "comprobante_tipo" },
      { title: "Comp. número", dataKey: "numero" },
      { title: "Categoria", dataKey: "categoria_iva" },
      { title: "Cliente", dataKey: "factura_cliente" },
      { title: "CUIT/DNI", dataKey: "descripcion" },
      { title: "Número", dataKey: "factura_documento" },
      { title: "Alícuota", dataKey: "alicuota" },
      { title: "Imp. IVA", dataKey: "importe_iva" },
      { title: "Imp. sin IVA", dataKey: "total_sin_iva" },
      { title: "Imp. gravado", dataKey: "importe_gravado" },
      { title: "Imp. ex. IVA", dataKey: "importe_exento_iva" },
      { title: "Total", dataKey: "importe_total" },
    ];
  }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();

    console.log(this._fechaHasta);
    this.getMedicosFacturan();
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
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

  accion(
    event: FacturaElectronica,
    overlaypanel: OverlayPanel,
    elemento: FacturaElectronica
  ) {
    if (elemento) {
      this.selecteditemRegistro = elemento;
    }

    console.log(this.selecteditemRegistro);
    overlaypanel.toggle(event);
  }

  filtered(event) {
    console.log(event.filteredValue);
    this.elementosFiltrados = event.filteredValue;
    console.log("llamando desde filter");
    this.sumarValoresSeleccionados(this.elementosFiltrados);
  }

  sumarValoresSeleccionados(vals: any) {
    console.log(this.selecteditems);
    // SUMO LO FILTRADO
    console.log(vals);
    this.total_seleccionado = 0;
    let i: number;
    for (i = 0; i < vals.length; i++) {
      this.total_seleccionado =
        this.total_seleccionado + Number(vals[i]["importe_total"]);
    }
  }

  sumarValores(resp: any[]): void {
    this.total_sumado = 0;
    this.total = 0;
    let i = 0;
    for (i = 0; i < resp.length; i++) {
      this.total_sumado = this.total_sumado + Number(resp[i]["importe_total"]);
    }
  }

  getMedicosFacturan() {
    this.loading = true;
    try {
      this.facturacionService.getMedicosFacturan().subscribe(
        (resp) => {
          this.elementosMedicos = resp;
          this.loading = false;
          console.log(this.elementosMedicos);
          this.elementoMedicos = this.elementosMedicos["0"];
          console.log(this.elementoMedicos["id"]);
          this.medico_id = this.elementoMedicos["id"];
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

  obtenerMedico() {
    console.log(this.elementoMedicos);
    this.medico_id = this.elementoMedicos["id"];
    this.medico_nombre = this.elementoMedicos["nombreyapellido"];
  }

  buscar() {
    this.elemento = [];
    this.selecteditems = [];
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd", "en");
    this.loading = true;
    if (this.tipo_busqueda === "fecha") {
      try {
        this.facturacionService
          .GetFacturaBetweenDates(this._fechaDesde, this._fechaHasta)
          .subscribe(
            (resp) => {
              let i: number = 0;
              let resultado = resp;
              resultado.forEach((element) => {
                resp[i]["factura_numero"] = this.padLeft(
                  resp[i]["factura_numero"],
                  "0",
                  8
                );
                resp[i]["punto_vta"] = this.padLeft(
                  resp[i]["punto_vta"],
                  "0",
                  4
                );
                i++;
              });
              this.realizarFiltroBusqueda(resp);
              this.sumarValores(resp);
              this.elemento = resp;
              this.loading = false;
              console.log(this.elemento);
            },
            (error) => {
              // error path
              console.log(error.message);
              console.log(error.status);
              swal({
                toast: false,
                type: "error",
                title: "Algo salio mal...",
                text: error.status + " " + error.message,
                showConfirmButton: false,
                timer: 2000,
              });
              this.loading = false;
            }
          );
      } catch (error) {
        swal({
          toast: false,
          type: "error",
          title: "Algo salio mal...",
          text: error.status + " " + error.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  }

  buscarMatricula() {
    this.elemento = [];
    this.selecteditems = [];
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd", "en");
    this.loading = true;
    if (this.tipo_busqueda === "fecha") {
      try {
        this.facturacionService
          .GetFacturaBetweenDatesMatricula(this._fechaDesde, this._fechaHasta)
          .subscribe(
            (resp) => {
              let i: number = 0;
              let resultado = resp;
              resultado.forEach((element) => {
                resp[i]["metodo_pago"] = resp[i]["mat_tipo_pago"];
                resp[i]["factura_numero"] = this.padLeft(
                  resp[i]["factura_numero"],
                  "0",
                  8
                );
                resp[i]["punto_vta"] = this.padLeft(
                  resp[i]["punto_vta"],
                  "0",
                  4
                );
                i++;
              });
              this.elemento = resp;
              this.loading = false;
              console.log(this.elemento);
              this.realizarFiltroBusqueda(resp);
              this.sumarValores(resp);
            },
            (error) => {
              // error path
              console.log(error.message);
              console.log(error.status);
              swal({
                toast: false,
                type: "error",
                title: "Algo salio mal...",
                text: error.status + " " + error.message,
                showConfirmButton: false,
                timer: 2000,
              });
              this.loading = false;
            }
          );
      } catch (error) {
        swal({
          toast: false,
          type: "error",
          title: "Algo salio mal...",
          text: error.status + " " + error.message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  }

  generarLibroIva() {
    this.estado = "Buscando libro iva para " + this.medico_nombre;
    this.elemento = [];
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd", "en");
    this.loading = true;
    console.log(this.medico_id);
    try {
      this.facturacionService
        .getLibroIva(this._fechaDesde, this._fechaHasta, this.medico_id)
        .subscribe(
          (resp) => {
            let i: number = 0;
            let resultado = resp;
            let total_factura: string = "";
            console.log(resp);
            resultado.forEach((element) => {
              resp[i]["fecha"] = formatDate(
                resp[i]["fecha"],
                "dd/MM/yyyy",
                "es-Ar"
              );
              // console.log('comprobante '+ resp[i]['numero']);
              // console.log('comprobante guardado '+ total_factura);

              if (resp[i].iva === "0.00") {
                //   console.log(resultado[i].iva);
                resp[i]["importe_gravado"] = this.cp.transform(
                  0,
                  "",
                  "",
                  "1.2-2"
                );
                resp[i]["importe_exento_iva"] = resp[i].total_sin_iva;
                resp[i]["importe_iva"] = this.cp.transform(0, "", "", "1.2-2");
              } else {
                resp[i]["importe_iva"] = resp[i].iva;
                resp[i]["importe_exento_iva"] = this.cp.transform(
                  0,
                  "",
                  "",
                  "1.2-2"
                );
              }
              if (resp[i]["numero"] === total_factura) {
                //  console.log('coincide ' + total_factura);
                resp[i]["importe_total"] = this.cp.transform(
                  0,
                  "",
                  "",
                  "1.2-2"
                );
              } else {
                total_factura = resp[i]["numero"];
                console.log("nuevo total " + total_factura);
              }

              // LLENO LOS ESPACIOS PARA MOSTRAR EN EL LISTADO DE PANTALLA
              //  resp[i]['nombreyapellido'] = resp[i]['factura_cliente'];
              //  resp[i]['descripcion'] = resp[i]['comprobante_tipo'];
              //  resp[i]['factura_numero'] =  this.padLeft(resp[i]['factura_numero'], '0', 8);
              //  resp[i]['factura_documento_comprador_descripcion'] = resp[i]['descripcion'];
              console.log(resp[i]);
              i++;
            });

            const fecha_desde = formatDate(
              this.fechaDesde,
              "dd/MM/yyyy",
              "es-Ar"
            );
            const fecha_hasta = formatDate(
              this.fechaHasta,
              "dd/MM/yyyy",
              "es-Ar"
            );
            this.estado = "Generando documento XLS";
            this.liquidacionService.exportAsExcelFile(
              resp,
              "libro IVA " +
                this.medico_nombre +
                " desde " +
                fecha_desde +
                " a " +
                fecha_hasta
            );
            this.estado = "";
            //  this.elemento = resp;
            this.loading = false;
            // console.log(this.elemento);
          },
          (error) => {
            // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: "error",
              title: "Algo salio mal...",
              text: error.status + " " + error.message,
              showConfirmButton: false,
              timer: 2000,
            });
            this.loading = false;
            this.estado = "";
          }
        );
    } catch (error) {
      this.estado = "";
      swal({
        toast: false,
        type: "error",
        title: "Algo salio mal...",
        text: error.status + " " + error.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                             TABLA MAS COMPLETA                             */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*           ALTO Y ANCHO MODIFICADO , ENCABEZADO SEGUNDA HOJA Y = 0          */
  /* -------------------------------------------------------------------------- */

  generarLibroIvaPdf() {
    this.estado = "Buscando libro iva para " + this.medico_nombre;
    console.log(this.estado);
    this.elemento = [];
    this._fechaDesde = formatDate(this.fechaDesde, "yyyy-MM-dd", "en");
    this._fechaHasta = formatDate(this.fechaHasta, "yyyy-MM-dd", "en");

    try {
      this.facturacionService
        .getLibroIva(this._fechaDesde, this._fechaHasta, this.medico_id)
        .subscribe(
          (resp) => {
            let i: number = 0;
            let resultado = resp;
            let total_factura: string = "";
            resultado.forEach((element) => {
              if (resp[i].iva === "0.00") {
                //   console.log(resultado[i].iva);
                resp[i]["importe_gravado"] = this.cp.transform(
                  0,
                  "",
                  "",
                  "1.2-2"
                );
                resp[i]["importe_exento_iva"] = resp[i].total_sin_iva;
                resp[i]["importe_iva"] = this.cp.transform(0, "", "", "1.2-2");
              } else {
                resp[i]["importe_iva"] = resp[i].iva;
                resp[i]["importe_exento_iva"] = this.cp.transform(
                  0,
                  "",
                  "",
                  "1.2-2"
                );
              }
              resp[i]["fecha"] = formatDate(
                resp[i]["fecha"],
                "dd/MM/yyyy",
                "es-Ar"
              );
              //    console.log('comprobante '+ resp[i]['numero']);
              //  console.log('comprobante guardado '+ total_factura);
              if (resp[i]["numero"] === total_factura) {
                //     console.log('coincide ' + total_factura);
                resp[i]["importe_total"] = this.cp.transform(
                  0,
                  "",
                  "",
                  "1.2-2"
                );
              } else {
                total_factura = resp[i]["numero"];
                //     console.log('nuevo total ' + total_factura);
              }

              // LLENO LOS ESPACIOS PARA MOSTRAR EN EL LISTADO DE PANTALLA
              resp[i]["nombreyapellido"] = resp[i]["factura_cliente"];
              resp[i]["descripcion"] = resp[i]["comprobante_tipo"];
              resp[i]["factura_numero"] = this.padLeft(
                resp[i]["numero"],
                "0",
                8
              );
              resp[i]["factura_documento_comprador_descripcion"] =
                resp[i]["descripcion"];

              i++;
            });
            resp = resultado;

            // this.elemento = resp;
            this.loading = false;
            //   this.estado = '';
            console.log(resp);
            this.ImprimirPdf(resp);
          },
          (error) => {
            // error path
            console.log(error.message);
            console.log(error.status);
            this.estado = "";
            swal({
              toast: false,
              type: "error",
              title: "Algo salio mal...",
              text: error.status + " " + error.message,
              showConfirmButton: false,
              timer: 2000,
            });
            this.loading = false;
          }
        );
    } catch (error) {
      this.estado = "";
      swal({
        toast: false,
        type: "error",
        title: "Algo salio mal...",
        text: error.status + " " + error.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  ImprimirPdf(ele) {
    const elemento = ele;
    console.log(elemento);
    if (elemento) {
      this.estado = "Generando PDF";
      this._fechaDesde = formatDate(this.fechaDesde, "dd/MM/yyyy", "en");
      this._fechaHasta = formatDate(this.fechaHasta, "dd/MM/yyyy", "en");

      const doc = new jsPDF("landscape");
      /** valores de la pagina**/
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      //doc.addImage(logo_clinica, 'PNG', 10, 10, 40, 11,undefined,'FAST');
      doc.setLineWidth(0.4);

      doc.setFontSize(8);
      doc.text(10, 25, "Médico / Clínica : " + this.medico_nombre);
      doc.setFontSize(10);
      doc.text(
        "SUBDIARIO DE IVA VENTAS",
        pageWidth / 2,
        15,
        null,
        null,
        "center"
      );
      doc.setFontSize(8);

      doc.text(pageWidth - 40, 10, "Desde : " + this._fechaDesde);
      doc.text(pageWidth - 40, 15, "Hasta : " + this._fechaHasta);
      doc.setFontSize(8);
      let pageNumber = doc.internal.getNumberOfPages();
      const totalPagesExp = "{total_pages_count_string}";
      doc.autoTable(this.columnsIva, elemento, {
        startY: 30,
        margin: { right: 5, bottom: 12, left: 5 },
        bodyStyles: { valign: "top" },
        styles: {
          fontSize: 5,
          cellWidth: "wrap",
          rowPageBreak: "auto",
          halign: "center",
          overflow: "linebreak",
        },
        columnStyles: {
          fecha: { columnWidth: 18 },
          comprobante_tipo: { columnWidth: 20 },
          numero: { columnWidth: 20 },
          categoria_iva: { columnWidth: 25 },
          factura_clienta: { columnWidth: 35 },
          descripcion: { columnWidth: 15 },
          factura_documento: { columnWidth: 20 },
          alicuota: { columnWidth: 20 },
          importe_iva: { columnWidth: 20 },
          total_sin_iva: { columnWidth: 20 },
          importe_gravado: { columnWidth: 20 },
          importe_excento_iva: { columnWidth: 20 },
          importe_total: { columnWidth: 20 },
        },
        addPageContent: (data) => {
          let footerStr = "Página " + doc.internal.getNumberOfPages();
          if (typeof doc.putTotalPages === "function") {
            footerStr = footerStr + " de " + totalPagesExp;
          }
          doc.setFontSize(10);
          doc.text(
            footerStr,
            data.settings.margin.left,
            doc.internal.pageSize.height - 5
          );
        },
      });

      if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPagesExp);
      }
      window.open(doc.output("bloburl"));
    }
    this.estado = "";
  }

  realizarNotaCredito() {
    this.loading = true;
    try {
      this.facturacionService
        .crearFacturaNotaCredito(this.selecteditemRegistro)
        .subscribe(
          (resp) => {
            let i: number = 0;
            let resultado = resp;

            console.log(resp);
            this.loading = false;
          },
          (error) => {
            // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: "error",
              title: "Algo salio mal...",
              text: error.status + " " + error.message,
              showConfirmButton: false,
              timer: 2000,
            });
            this.loading = false;
          }
        );
    } catch (error) {
      swal({
        toast: false,
        type: "error",
        title: "Algo salio mal...",
        text: error.status + " " + error.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  imprimir() {
    this.loading = true;
    try {
      this.facturacionService
        .GetFacturaById(this.selecteditemRegistro["id"])
        .subscribe(
          (resp) => {
            let i: number = 0;
            let resultado = resp;
            this.elementosPDF = resp["factura"];
            this.elementosMatricula = resp["matricula"];
            this.elementosCobro = resp["cobro"];
            console.log(this.elementosPDF);
            this.generarPdf();
            this.loading = false;
          },
          (error) => {
            // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: "error",
              title: "Algo salio mal...",
              text: error.status + " " + error.message,
              showConfirmButton: false,
              timer: 2000,
            });
            this.loading = false;
          }
        );
    } catch (error) {
      swal({
        toast: false,
        type: "error",
        title: "Algo salio mal...",
        text: error.status + " " + error.message,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }

  generarPdf() {
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

    doc.setFontSize(9);

    doc.setFontStyle("normal");
    doc.setFontSize(9);
    doc.text(
      "Fecha Emisión: " +
        formatDate(this.selecteditemRegistro["fecha"], "dd/MM/yyyy", "en"),
      pageWidth / 2 + 10,
      28
    );

    doc.setFontSize(9);
    doc.setFontStyle("bold");
    doc.text(
      "Total: " +
        this.cp.transform(
          this.selecteditemRegistro["importe_total"],
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
    // DEBE CAMBIARSE LA FECHA POR LA FECHA DE MATRICULA
    doc.setFontStyle("normal");
    console.log(this.elementosPDF);
    let i = 0;
    let elementosAimprimir: any[] = [];
    if (this.elementosMatricula.length > 0) {
      doc.setFontStyle("bold");
      doc.setFontSize(11);
      doc.text(
        "RECIBO NUMERO: " + this.selecteditemRegistro["factura_numero"],
        pageWidth / 2 + 10,
        18
      );
      doc.setFontStyle("normal");
      doc.setFontSize(8);
      doc.text(
        "Psicólogo: " + this.selecteditemRegistro["factura_cliente"],
        pageWidth / 2 + 10,
        36
      );
      doc.text(
        "Matrícula: " + this.selecteditemRegistro["factura_documento"],
        pageWidth / 2 + 10,
        32
      );
      doc.text(
        "Método de pago: " + this.elementosPDF[0]["metodo_pago"],
        pageWidth / 2 + 10,
        40
      );
      elementosAimprimir = this.elementosMatricula;
      this.elementosMatricula.forEach((element) => {
        (elementosAimprimir[i]["fecha"] = formatDate(
          element["mat_fecha_vencimiento"],
          "dd/MM/yyyy",
          "en"
        )),
          (elementosAimprimir[i]["importe_total"] = this.cp.transform(
            element["mat_monto_cobrado"],
            "",
            "symbol-narrow",
            "1.2-2"
          ));
        elementosAimprimir[i]["total_renglon"] = this.cp.transform(
          element["mat_monto_cobrado"],
          "",
          "symbol-narrow",
          "1.2-2"
        );

        elementosAimprimir[i]["mat_concepto"] = element["mat_concepto"];
        elementosAimprimir[i]["mat_id_plan"] = element["mat_id_plan"];
        elementosAimprimir[i]["mat_num_cuota"] = element["mat_num_cuota"];
        elementosAimprimir[i]["descripcion"] = element["descripcion"];
        i++;
      });

      this.colsRecibo = [
        { title: "Concepto", dataKey: "mat_concepto" },
        { title: "Plan", dataKey: "mat_id_plan" },
        { title: "Vencimiento", dataKey: "mat_fecha_vencimiento" },
        { title: "Cuota", dataKey: "mat_num_cuota" },
        { title: "Descripción", dataKey: "descripcion" },
        { title: "Importe", dataKey: "total_renglon" },
      ];
    }
    if (this.elementosCobro.length > 0) {
      elementosAimprimir = this.elementosCobro;
      doc.setFontStyle("bold");
      doc.setFontSize(11);
      doc.text(
        "RECIBO " +
          this.selecteditemRegistro["modulo_gravado"] +
          ": " +
          this.selecteditemRegistro["factura_numero"],
        pageWidth / 2 + 10,
        18
      );
      doc.setFontStyle("normal");
      doc.setFontSize(8);
      doc.text(
        "Nombre: " + this.selecteditemRegistro["factura_cliente"],
        pageWidth / 2 + 10,
        36
      );
      doc.text(
        "C.U.I.T: " + this.selecteditemRegistro["factura_documento"],
        pageWidth / 2 + 10,
        32
      );
      doc.text(
        "Método de pago: " + this.elementosPDF[0]["metodo_pago"],
        pageWidth / 2 + 10,
        40
      );
      this.elementosCobro.forEach((element) => {
        elementosAimprimir[i]["proveedor_nombre"] = element["proveedor_nombre"];
        elementosAimprimir[i]["concepto_cuenta"] = element["concepto_cuenta"];
        elementosAimprimir[i]["descripcion"] = element["descripcion"];
        elementosAimprimir[i]["importe"] = this.cp.transform(
          element["importe"],
          "",
          "symbol-narrow",
          "1.2-2"
        );
        i++;
      });
      this.colsRecibo = [
        { title: "A nombre", dataKey: "proveedor_nombre" },
        { title: "Concepto", dataKey: "concepto_cuenta" },
        { title: "Descripción", dataKey: "descripcion" },
        { title: "Total", dataKey: "importe" },
      ];
    }

    if (
      this.elementosCobro.length === 0 &&
      this.elementosMatricula.length === 0
    ) {
      doc.setFontStyle("bold");
      doc.setFontSize(11);
      doc.text(
        "RECIBO NUMERO: " + this.selecteditemRegistro["factura_numero"],
        pageWidth / 2 + 10,
        18
      );
      doc.setFontStyle("normal");
      doc.text(
        "Nombre: " + this.selecteditemRegistro["factura_cliente"],
        pageWidth / 2 + 10,
        36
      );
      doc.text(
        "C.U.I.T: " + this.selecteditemRegistro["factura_documento"],
        pageWidth / 2 + 10,
        32
      );
      doc.text(
        "Método de pago: " + this.elementosPDF[0]["metodo_pago"],
        pageWidth / 2 + 10,
        40
      );
      elementosAimprimir = this.elementosPDF;
      this.colsRecibo = [
        { title: "Descripcion", dataKey: "descripcion" },
        { title: "Cant", dataKey: "cantidad" },
        { title: "Precio unit.", dataKey: "precio_unitario" },
        { title: "Alic.", dataKey: "alicuota_descripcion" },
        { title: "Iva", dataKey: "iva" },
        { title: "Importe", dataKey: "total_renglon" },
      ];
    }

    doc.autoTable(this.colsRecibo, elementosAimprimir, {
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
    this.selecteditems = [];
    this.reciboEncabezado = null;
    this.elementosMatricula = [];
    this.elementosCobro = [];
    this.elementoComprobante = null;
    this.recibo_registros = [];
    this.elementosPDF = [];
    this.total = 0;
  }

  realizarFiltroBusqueda(resp: any[]) {
    // FILTRO LOS ELEMENTOS QUE SE VAN USAR PARA FILTRAR LA LISTA
    this._descripcion = [];
    this._punto_vta = [];
    this._factura_numero = [];
    this._factura_cliente = [];
    this._factura_documento = [];
    this._metodo_pago = [];
    this._creado = [];

    resp.forEach((element) => {
      this._descripcion.push(element["descripcion"]);
      this._punto_vta.push(element["punto_vta"]);
      this._factura_numero.push(element["factura_numero"]);
      this._factura_cliente.push(element["factura_cliente"]);
      this._factura_documento.push(element["factura_documento"]);
      this._metodo_pago.push(element["metodo_pago"]);
      this._creado.push(element["creado"]);

      /** SUMO LO FILTRADO */
    });

    // ELIMINO DUPLICADOS
    this._descripcion = this.filter.filterArray(this._descripcion);
    this._punto_vta = this.filter.filterArray(this._punto_vta);
    this._factura_numero = this.filter.filterArray(this._factura_numero);
    this._factura_cliente = this.filter.filterArray(this._factura_cliente);
    this._factura_documento = this.filter.filterArray(this._factura_documento);
    this._metodo_pago = this.filter.filterArray(this._metodo_pago);
    this._creado = this.filter.filterArray(this._creado);
  }

  public exportarExcelDetallado() {
    const fecha_impresion = formatDate(new Date(), "dd-MM-yyyy-mm", "es-Ar");
    let seleccionados: any[] = [];
    let exportar: any[] = [];
    let i = 0;
    this.selecteditems.forEach((element) => {
      seleccionados["descripcion"] = element.descripcion;
      seleccionados["punto_vta"] = element.punto_vta;
      seleccionados["factura_numero"] = element.factura_numero;
      seleccionados["fecha"] = formatDate(
        element["fecha"],
        "dd/MM/yyyy",
        "es-Ar"
      );
      seleccionados["factura_cliente"] = element.factura_cliente;
      seleccionados["factura_documento"] = element.factura_documento;
      let _importe_total: "";
      _importe_total = element.importe_total.toString();
      seleccionados["importe_total"] = _importe_total.replace(".", ",");
      seleccionados["metodo_pago"] = element.metodo_pago;
      seleccionados["creado"] = element.creado;
      exportar[i] = seleccionados;
      seleccionados = [];
      i++;
    });
    console.log(exportar);
    this.excelService.exportAsExcelFile(
      exportar,
      "listado_pagos_" + fecha_impresion
    );
  }

  /* generarPDF(){


  // GENERO EL FORMATO DE LOS COBROS

  
  let i = 0;
  for(i= 0; i< this.elementosPDF.length; i++){
      this.elementosPDF[i]['alicuota'] = this.cp.transform(this.elementosPDF[i]['alicuota'], '', 'symbol-narrow', '1.2-2');
      this.elementosPDF[i]['iva'] = this.cp.transform(this.elementosPDF[i]['iva'], '', 'symbol-narrow', '1.2-2');
      this.elementosPDF[i]['precio_unitario'] = this.cp.transform(this.elementosPDF[i]['precio_unitario'], '', 'symbol-narrow', '1.2-2');
      this.elementosPDF[i]['total_renglon'] = this.cp.transform(this.elementosPDF[i]['total_renglon'], '', 'symbol-narrow', '1.2-2');
      this.elementosPDF[i]['total_sin_iva'] = this.cp.transform(this.elementosPDF[i]['total_sin_iva'], '', 'symbol-narrow', '1.2-2');
      
  }

  this._fecha = formatDate(this.elementosPDF[0]['fecha'], 'dd/MM/yyyy', 'en');
  //let inicio_actividades =  formatDate(this.elementosPDF[0]['fecha_alta_afip'], 'dd/MM/yyyy', 'en'); 
  var doc = new jsPDF();  

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
  doc.line((pageWidth/2)-6,10 , (pageWidth/2)-6, 23);  // linea vertical izquierda
  doc.line((pageWidth/2)+6,10 , (pageWidth/2)+6, 23);  // linea vertical derecha
  doc.line((pageWidth/2)-6,23 , (pageWidth/2)+6, 23); //linea inferior horizontal

  //borde fecha emision desde hasta

  doc.line(10, 55, pageWidth - 10, 55); //linea superior horizontal
  doc.line(10, 55, 10, 63); // linea vertical izquierda
  doc.line(pageWidth - 10, 55, pageWidth - 10, 63); // linea vertical derecha
  doc.line(10, 63, pageWidth - 10, 63); //linea inferior horizontal

  // borde datos del clinete

  doc.line(10, 65, pageWidth - 10, 65); //linea superior horizontal
  doc.line(10, 65, 10, 90); // linea vertical izquierda
  doc.line(pageWidth - 10, 65, pageWidth - 10, 90); // linea vertical derecha
  doc.line(10, 90, pageWidth - 10, 90); //linea inferior horizontal



  doc.line(10, pageHeight - 25,  10 , pageHeight - 15); // linea vertical izquierda
  doc.line(pageWidth - 10, pageHeight -25, pageWidth - 10, pageHeight -15); // linea vertical derecha
  doc.line(10, pageHeight -25, pageWidth - 10, pageHeight -25); //linea superior horizontal
  doc.line(10, pageHeight -15, pageWidth - 10, pageHeight -15); //linea inferior horizontal

  

// linea divisoria
  doc.line(pageWidth/2, 23, pageWidth /2, 50);
  doc.setFontSize(19);
  doc.setFontStyle("bold");
  doc.text(this.elementosPDF[0]['letra'], (pageWidth/2)-2.5, 17); 
  doc.setFontStyle("normal");
  doc.setFontSize(6);
  doc.text('COD. '+this.elementosPDF[0]['comprobante_codigo'], (pageWidth/2)-4.5, 21); 
  let img = new Image();
  img.src = './assets/images/user-default.png';
  doc.addImage(img, 'PNG', 10, 10, 22, 22, undefined, 'FAST');
  doc.setFontSize(9);
  
  doc.text(this.elementosPDF[0]['nombreyapellido'], 15, 35); 
  doc.setFontStyle("normal");
  doc.setFontSize(9);
  console.log(this.elementosPDF[0]);
  doc.text(this.elementosPDF[0]['domicilio'], 15, 40); 
  doc.text(this.elementosPDF[0]['categoria_iva'],15 , 45); 
  // izquierda
  doc.setFontSize(9);
  doc.text('Comprobante: '+ this.padLeft(this.elementosPDF[0]['punto_vta'],'0', 4)+' - '+ 
  this.padLeft(this.elementosPDF[0]['factura_numero'],'0', 8), (pageWidth/2)+20, 20); 
  doc.setFontSize(9);
  doc.text('Fecha Emisión: '+ this._fecha, (pageWidth/2)+20, 25); 
  doc.text('C.U.I.T.: '+ this.elementosPDF[0]['cuit'], (pageWidth/2)+20, 30); 
  doc.text('Ingresos brutos: '+ this.elementosPDF[0]['ing_brutos'], (pageWidth/2)+20, 35); 
  doc.text('Inicio de actividades: '+ this.elementosPDF[0]['fecha_alta_afip'], (pageWidth/2)+20, 40); 
  doc.setLineWidth(0.4);

  //DATOS DE FECHA

  this._fechaDesde = formatDate(this.fechaDesde, 'yyyy-MM-dd', 'en');
  this._fechaHasta = formatDate(this.fechaHasta, 'yyyy-MM-dd', 'en');
  doc.text('Período Facturado   Desde: '+formatDate(this.fechaDesde, 'dd/MM/yyyy', 'en'), 15, 60); 
  doc.text('Hasta: '+formatDate(this.fechaHasta, 'dd/MM/yyyy', 'en'), pageWidth/2, 60); 

  //DATOS DEL CLIENTE

  doc.text(this.elementosPDF[0]['factura_comprobante_descripcion']+' : '+ this.elementosPDF[0]['factura_documento'], 15, 73); 
  doc.text('Cliente: '+  this.elementosPDF[0]['factura_cliente'], 15, 78); 
  doc.text('Condición frente al IVA: '+ this.elementosPDF[0]['categoria_iva'], 15, 83);  // PENDIENTE

  // TOTAL DE LA FACTURA
  doc.setFontSize(10);
  doc.setFontStyle("bold");
  doc.text('Subtotal: '+ this.cp.transform(this.elementosPDF[0]['importe_gravado'], '', 'symbol-narrow', '1.2-2'), 15, pageHeight -18); 
  if((this.elementosPDF[0]['factura_comprobante_id'] === 6)||(this.elementosPDF[0]['factura_comprobante_id'] === 11)){}else{
    doc.text('Imp. IVA: '+ this.cp.transform(this.elementosPDF[0]['importe_iva'], '', 'symbol-narrow', '1.2-2'), 75, pageHeight -18); 
  }
  
  doc.text('Total: '+ this.cp.transform(this.elementosPDF[0]['importe_total'], '', 'symbol-narrow', '1.2-2'), pageWidth-50, pageHeight -18); 
  // PIE DE LA FACTURAimport { LiquidacionService } from './../../../../services/liquidacion.service';



  doc.text('CAE: '+ this.elementosPDF[0]['cae'], 15, pageHeight -5); 
  doc.text('Fecha de vencimiento de CAE: '+ formatDate(this.elementosPDF[0]['cae_vto'], 'dd/MM/yyyy', 'en') , (pageWidth/2)+20, pageHeight -5); 
  doc.setFontStyle("normal");
  doc.autoTable(this.columns, this.elementosPDF,
  {
    
      margin: {vertical: 95, right:0,horizontal: -10},
      bodyStyles: {valign: 'top'},
      styles: {fontSize: 8,cellWidth: 'wrap', rowPageBreak: 'auto', halign: 'justify',overflow: 'linebreak'},       
      columnStyles: {descripcion: {columnWidth: 88}, cantidad: {columnWidth: 10}, precio_unitario: {columnWidth: 25},
      alicuota_descripcion: {columnWidth: 12},  iva: {columnWidth: 25}, total_renglon: {columnWidth: 25} }
  });
  window.open(doc.output('bloburl'));    
  this.elementosPDF = [];
  } */
}
