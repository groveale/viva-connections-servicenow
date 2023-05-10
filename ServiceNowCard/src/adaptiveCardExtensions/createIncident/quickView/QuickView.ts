import { ISPFxAdaptiveCard, BaseAdaptiveCardView, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CreateIncidentAdaptiveCardExtensionStrings';
import { CONFIRM_VIEW_REGISTRY_ID, ICreateIncidentAdaptiveCardExtensionProps, ICreateIncidentAdaptiveCardExtensionState } from '../CreateIncidentAdaptiveCardExtension';
import { IIncident, Incident } from '../../../models/IIncident';

export interface IQuickViewData {
  ticket: Incident;
  strings: ICreateIncidentAdaptiveCardExtensionStrings;
  username: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ICreateIncidentAdaptiveCardExtensionProps,
  ICreateIncidentAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      ticket: this.state.ticket,
      username: this.context.pageContext.user.displayName,
      strings: strings
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

  public async onAction(action: ISubmitActionArguments): Promise<void> {
    if (action.type === 'Submit') {
      const { id } = action.data;
      if (id === 'confirm') {
        const newTicket: IIncident = new Incident(this.state.ticket.number, action.data?.description, "", this.state.ticket.sys_updated_on, action.data?.category, action.data?.urgency, this.state.ticket.LastUpdatedString);
        this.setState({ ticket: newTicket });
        this.quickViewNavigator.push(CONFIRM_VIEW_REGISTRY_ID, false);
      } else {
        this.quickViewNavigator.close();
      }
    }
}
}