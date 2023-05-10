import { ISPFxAdaptiveCard, BaseAdaptiveCardView, ISubmitActionArguments, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyIncidentsAdaptiveCardExtensionStrings';
import { IMyIncidentsAdaptiveCardExtensionProps, IMyIncidentsAdaptiveCardExtensionState } from '../MyIncidentsAdaptiveCardExtension';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { IIncident } from '../../../models/IIncident';


export interface IQuickViewData {
  numberOfTasks: string;
  tickets: IIncident[];
  strings: IMyIncidentsAdaptiveCardExtensionStrings;
}

// const getAccessToken = async (): Promise<string> => {
//   const authResponse = await new Promise<any>((resolve, reject) => {
//     const authPopup = window.open('https://google.com', 'auth-popup', 'width=600,height=600');
//     window.addEventListener('message', (event) => {
//       if (event.origin === window.location.origin && event.source === authPopup) {
//         resolve(event.data);
//       }
//     }, false);
//   });
//   return authResponse.access_token;
// };

// const callApi = async (): Promise<void> => {
//   const accessToken = await getAccessToken();
//   // const client = new AadHttpClient(this.context.serviceScope, '{yourApiResource}', accessToken);
//   // const response: HttpClientResponse = await client.get('{yourApiEndpoint}');
//   // const result: string = await response.text();
//   console.log(accessToken);
// };

export class QuickView extends BaseAdaptiveCardView<
  IMyIncidentsAdaptiveCardExtensionProps,
  IMyIncidentsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {

    //callApi()

    let numberOfTasks: string = strings.CardViewNoTasks;
    if (this.state.tickets.length > 1) {
      numberOfTasks = `${this.state.tickets.length.toString()} ${strings.CardViewTextPlural}`;
    } else {
      numberOfTasks = `${this.state.tickets.length.toString()} ${strings.CardViewTextSingular}`;
    }
    
    return {
      numberOfTasks: numberOfTasks,
      tickets: this.state.tickets,
      strings: strings,
    };
  }


  // public async onAction(action: IActionArguments): Promise<void> {
  //   try {
  //     if ((<ISubmitActionArguments>action).type === 'Submit') {
  //       const submitAction = <ISubmitActionArguments>action;
  //       const { id, incidentNumber } = submitAction.data;
  //       if (id === 'selectTicket') {
  //         this.setState({ currentIncidentNumber: incidentNumber });
  //         this.quickViewNavigator.push(EDITT_VIEW_REGISTRY_ID);
  //       }
  //     }
  //   } catch (err) {
  //     //Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
  //   }
  // }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}