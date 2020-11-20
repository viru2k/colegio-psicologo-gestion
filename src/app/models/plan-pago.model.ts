import { Concepto } from './concepto.model';

export class PlanPago {


    plan: Concepto[];
    concepto: Concepto[];



    constructor(
        plan: Concepto[],
        concepto: Concepto[]
          ) {

       this.plan = plan;
       this.concepto = concepto;
    }
}