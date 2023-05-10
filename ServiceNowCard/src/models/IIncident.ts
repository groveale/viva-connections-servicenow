export interface IIncident {
    number: string;
    short_description: string;
    caller_id: string;
    sys_updated_on: Date;
    category: string;
    urgency: string;
    LastUpdatedString: string;
  }

  export class Incident implements IIncident {
    constructor(
      public number: string = "",
      public short_description: string = "",
      public caller_id: string = "",
      public sys_updated_on: Date = new Date(),
      public category: string = "",
      public urgency: string = "",
      public LastUpdatedString: string = ""
    ) { }
  }

  export interface INewIncident {
    incident: IIncident;
  }
  