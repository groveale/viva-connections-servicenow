import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyIncidentsAdaptiveCardExtensionStrings';
import { IMyIncidentsAdaptiveCardExtensionProps, IMyIncidentsAdaptiveCardExtensionState } from '../MyIncidentsAdaptiveCardExtension';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

const getAccessToken = async (): Promise<string> => {
  const authResponse = await new Promise<any>((resolve, reject) => {
    const authPopup = window.open('https://google.com', 'auth-popup', 'width=600,height=600');
    window.addEventListener('message', (event) => {
      if (event.origin === window.location.origin && event.source === authPopup) {
        resolve(event.data);
      }
    }, false);
  });
  return authResponse.access_token;
};

const callApi = async (): Promise<void> => {
  const accessToken = await getAccessToken();
  // const client = new AadHttpClient(this.context.serviceScope, '{yourApiResource}', accessToken);
  // const response: HttpClientResponse = await client.get('{yourApiEndpoint}');
  // const result: string = await response.text();
  console.log(accessToken);
};

export class QuickView extends BaseAdaptiveCardView<
  IMyIncidentsAdaptiveCardExtensionProps,
  IMyIncidentsAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {

    callApi()
    
    return {
      subTitle: strings.SubTitle,
      title: strings.Title
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}