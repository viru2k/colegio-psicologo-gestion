export class ReciboElectronicoCaja {
  descripcion: string;
  total: number;

  constructor(descripcion: string, total: number) {
    this.descripcion = descripcion;
    this.total = total;
  }
}
