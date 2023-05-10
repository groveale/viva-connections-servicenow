import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { CreateIncidentPropertyPane } from './CreateIncidentPropertyPane';
import { IIncident, Incident } from '../../models/IIncident';
import { random } from '@microsoft/sp-lodash-subset';
import { HttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import { ConfirmView } from './quickView/ConfirmView';

export interface ICreateIncidentAdaptiveCardExtensionProps {
  title: string;
}

export interface ICreateIncidentAdaptiveCardExtensionState {
  ticket: IIncident
}

const CARD_VIEW_REGISTRY_ID: string = 'CreateIncident_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'CreateIncident_QUICK_VIEW';
export const CONFIRM_VIEW_REGISTRY_ID: string = 'CreateIncident_CONFIRM_VIEW'

export default class CreateIncidentAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICreateIncidentAdaptiveCardExtensionProps,
  ICreateIncidentAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: CreateIncidentPropertyPane | undefined;

  public onInit(): Promise<void> {

    let ticket: Incident = new Incident();
    let today: Date = new Date();
    ticket.number = "INC00" + random(11111, 99999, false).toString();
    ticket.LastUpdatedString = today.toISOString().substring(0, 19) + "Z";;
    this.state = {
      ticket: ticket
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(CONFIRM_VIEW_REGISTRY_ID, () => new ConfirmView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'CreateIncident-property-pane'*/
      './CreateIncidentPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.CreateIncidentPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }


  
}
