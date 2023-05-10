import {
  BaseImageCardView,
  IExternalLinkCardAction,
  IImageCardParameters,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'CreateIncidentAdaptiveCardExtensionStrings';
import { ICreateIncidentAdaptiveCardExtensionProps, ICreateIncidentAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../CreateIncidentAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ICreateIncidentAdaptiveCardExtensionProps, ICreateIncidentAdaptiveCardExtensionState> {
  public get data(): IImageCardParameters  {
    return {
      primaryText: strings.CardViewText,
      imageUrl: strings.ImageUrl,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
