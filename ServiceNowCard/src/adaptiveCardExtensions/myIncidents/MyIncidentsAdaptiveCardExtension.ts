import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MyIncidentsPropertyPane } from './MyIncidentsPropertyPane';
import { HttpClient, HttpClientResponse, AadHttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import { IIncident } from '../../models/IIncident';


export interface IMyIncidentsAdaptiveCardExtensionProps {
  title: string;
}

export interface IMyIncidentsAdaptiveCardExtensionState {
  tickets: IIncident[];
}

const CARD_VIEW_REGISTRY_ID: string = 'MyIncidents_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyIncidents_QUICK_VIEW';

export default class MyIncidentsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyIncidentsAdaptiveCardExtensionProps,
  IMyIncidentsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyIncidentsPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      tickets: []
     };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    try {
      await this._getIncidentsFromServiceNow();
    }
    catch (error) {
      // Error getting tickets from service now
      console.log(error);
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MyIncidents-property-pane'*/
      './MyIncidentsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MyIncidentsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  private _getIncidentsFromServiceNow(): Promise<void> {

    var upn = this.context.pageContext.user.email
    // for debugging purposes, you can hardcode the UPN here
    //upn = "admin@example.com"

    return this.context.httpClient
    .get(`https://ag-viva-connections-servicenow.azurewebsites.net/api/GetIncidentsForUser?upn=${upn}`, HttpClient.configurations.v1,)
    .then(response => response.json())
    .then(incidents => {
      this.setState({
        tickets: incidents.result
      });
    });
  }
}
