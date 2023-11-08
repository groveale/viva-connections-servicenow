using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace groveale
{

    public class ServiceNowHelper
    {
        private readonly HttpClient _client;
        private static Settings _settings;
        private User _serviceNowUser;

        public ServiceNowHelper(Settings settings)
        {
            _settings = settings;
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Accept.Clear();
            _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task Init(string upnFromSPO) 
        {
            // Can load settings here

            var token = await GetToken();
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token.access_token);

            if (!string.IsNullOrEmpty(upnFromSPO))
            {
                // Get the user from the email address
                var usersResponse = await GetUserFromEmailAsync(upnFromSPO);

                if (usersResponse.result.Count == 0)
                {
                    // No service now user found, log error and exit
                    throw new Exception($"No user found in ServiceNow with email {upnFromSPO}");
                }
                else {
                    _serviceNowUser = usersResponse.result[0];
                } 
            }
        }

        public async Task<TokenResponse> GetToken() 
        {
            var authHeader = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes($"{_settings.ClientId}:{_settings.ClientSecret}")));
            _client.DefaultRequestHeaders.Authorization = authHeader;
            var content = new StringContent("grant_type=password" +
                $"&client_id={_settings.ClientId}" +
                $"&client_secret={_settings.ClientSecret}" +
                $"&username={_settings.Username}" +
                $"&password={_settings.Password}");
            content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
            var tokenResponse = await _client.PostAsync($"https://{_settings.Domain}.service-now.com/oauth_token.do", content);
            
            var accessToken = await tokenResponse.Content.ReadAsAsync<TokenResponse>();

            return accessToken;
        }

        public async Task<UserApiResponse> GetUserFromEmailAsync(string upn)
        {
            // Select user email from sys_user table
            var url = $"https://{_settings.Domain}.service-now.com/api/now/table/sys_user?sysparm_query=email={upn}&sysparm_fields=email,user_name,sys_id";
            var response = await _client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to get data from API: {response.StatusCode} - {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsAsync<UserApiResponse>();
        }

        public async Task<IncidentApiResponse> GetIncidentsForUserAsync()
        {
            if (_serviceNowUser == null)
            {
                throw new Exception("ServiceNow user not initialized");
            }

            // Select user email from sys_user table
            var url = $"https://{_settings.Domain}.service-now.com/api/now/table/incident?caller_id={_serviceNowUser.sys_id}&sysparm_fields=number,short_description,sys_updated_on,category";
            var response = await _client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to get data from API: {response.StatusCode} - {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsAsync<IncidentApiResponse>();
        }

        public async Task<IncidentCreateApiResponse> CreateIncidentFromUserAsync(Incident fromSPO)
        {
            if (_serviceNowUser == null)
            {
                throw new Exception("ServiceNow user not initialized");
            }

            // add the caller id to the incident (logged in user)
            fromSPO.caller_id = _serviceNowUser.sys_id;

            // Select user email from sys_user table
            var url = $"https://{_settings.Domain}.service-now.com/api/now/table/incident";

            var response = await _client.PostAsJsonAsync(url, fromSPO);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to post data from API: {response.StatusCode} - {response.ReasonPhrase}");
            }

            return await response.Content.ReadAsAsync<IncidentCreateApiResponse>();
        }
    
        public async Task<ServiceNowChangeTicketResponse> GetChangeFromNumber(string changeNumber)
        {
            // Select user email from sys_user table
            var url = $"https://{_settings.Domain}.service-now.com/api/now/table/change_request?number={changeNumber}&sysparm_fields=end_date,number,short_description,assignment_group,u_owner_group,state,type,assigned_to,start_date";
            var response = await _client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to get data from API: {response.StatusCode} - {response.ReasonPhrase}");
            }

            //return JsonConvert.DeserializeObject<ServiceNowChangeTicketResponse>(response.Content.ToString());

            return await response.Content.ReadAsAsync<ServiceNowChangeTicketResponse>();
        }

        public async Task<ServiceNowCreateChangeTicketResponse> CreateChange(ChangeTicket fromPS)
        {
            // Select user email from sys_user table
            var url = $"https://{_settings.Domain}.service-now.com/api/now/table/change_request";

            var response = await _client.PostAsJsonAsync(url, fromPS);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to post data from API: {response.StatusCode} - {response.ReasonPhrase}");
            }

            var sNowChange = await response.Content.ReadAsAsync<ServiceNowChangeTicketResponseNonList>();

            if (!String.IsNullOrEmpty(sNowChange.Result.number))
            {
                return new ServiceNowCreateChangeTicketResponse()
                { 
                    Result = new ServiceNowChangeCreatedDetails() 
                    { 
                        Details = $"{sNowChange.Result.number} (RAISED)" 
                    } 
                };
            } 
            else 
            {
                return new ServiceNowCreateChangeTicketResponse()
                { 
                    Result = new ServiceNowChangeCreatedDetails() 
                    { 
                        Details = $"Error creating change ticket" 
                    } 
                };
            }
        }
    }
}