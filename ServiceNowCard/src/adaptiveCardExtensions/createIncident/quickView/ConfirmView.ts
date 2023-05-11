import { ISPFxAdaptiveCard, BaseAdaptiveCardView, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CreateIncidentAdaptiveCardExtensionStrings';
import { ICreateIncidentAdaptiveCardExtensionProps, ICreateIncidentAdaptiveCardExtensionState } from '../CreateIncidentAdaptiveCardExtension';
import { INewIncident, Incident } from '../../../models/IIncident';
import { HttpClient, IHttpClientOptions } from '@microsoft/sp-http';

export interface IConfirmViewData {
  ticket: Incident;
  strings: ICreateIncidentAdaptiveCardExtensionStrings;
  confirmLink: string;
  username: string;
}

export class ConfirmView extends BaseAdaptiveCardView<
  ICreateIncidentAdaptiveCardExtensionProps,
  ICreateIncidentAdaptiveCardExtensionState,
  IConfirmViewData
> {
  public get data(): IConfirmViewData {
    return {
      ticket: this.state.ticket,
      strings: strings,
      username: this.context.pageContext.user.displayName,
      confirmLink: ""
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ConfirmView.json');
  }

  public async onAction(action: ISubmitActionArguments): Promise<void> {
      if (action.type === 'Submit') {
        const { id } = action.data;
        if (id === 'cancel') {
          this.quickViewNavigator.close();
        } else {

          try {
            // send to api
            await this.CreateTicketInServiceNow()
          }
          catch (e){
            console.log(`Error: ${e.message}`)
          } finally {
          // close the dialog
          this.quickViewNavigator.close();
          }
        }
      }
    }

    private async CreateTicketInServiceNow() : Promise<void> {

      const requestHeaders: Headers = new Headers();
      requestHeaders.append('Content-type', 'application/json');

      const newIncident: INewIncident = {
        incident: this.state.ticket
      };
  
      const body: string = JSON.stringify(newIncident);
  
      console.log(body)
  
      const httpClientOptions: IHttpClientOptions = {
        body: body,
        headers: requestHeaders
      };
  
      return await this.context.httpClient.post(
          `https://ag-viva-connections-servicenow.azurewebsites.net/api/CreateIncidentForUser?upn=${this.context.pageContext.user.email}`,
          HttpClient.configurations.v1, 
          httpClientOptions)
          .then(response => {
            console.log(response.status)
          });
    }
}