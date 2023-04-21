import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { MyIncidentsPropertyPane } from './MyIncidentsPropertyPane';

export interface IMyIncidentsAdaptiveCardExtensionProps {
  title: string;
}

export interface IMyIncidentsAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'MyIncidents_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'MyIncidents_QUICK_VIEW';

export default class MyIncidentsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyIncidentsAdaptiveCardExtensionProps,
  IMyIncidentsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyIncidentsPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

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
}
