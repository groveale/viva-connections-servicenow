using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace groveale
{
    public static class GetIncidentsForUser
    {
        [FunctionName("GetIncidentsForUser")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string upn = req.Query["upn"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            upn = upn ?? data?.upn;

            // Load settings and initialize GraphHelper with app only auth
            var settings = Settings.LoadSettings();

            try {
                var serviceNowHelper = new ServiceNowHelper(settings);

                // Initialize the ServiceNowHelper with the user's email address
                await serviceNowHelper.Init(upn);

                // Get the incidents for the user
                var incidents = await serviceNowHelper.GetIncidentsForUserAsync();

                foreach (var incident in incidents.result) {
                    incident.LastUpdatedString = incident.sys_updated_on.ToString("yyyy-MM-ddTHH:mm:ssZ");
                }

                return new OkObjectResult(incidents);

            }
            catch (Exception ex) {
                return new BadRequestObjectResult("Error connecting to Service Now: " + ex.Message);
            }
        }
    }
}
