using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Specialized;

namespace groveale
{
    public static class CreateChange
    {
        [FunctionName("CreateChange")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            // needs to accept form data too

            // string short_description = req.Query["short_description"];
            // string start_date = req.Query["start_date"];
            // string end_date = req.Query["end_date"];
            // string created_by = req.Query["created_by"];
            // string template = req.Query["template"];

            // string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            // dynamic data = JsonConvert.DeserializeObject(requestBody);
           
            // short_description = short_description ?? data?.short_description;
            // start_date = start_date ?? data?.start_date;
            // end_date = end_date ?? data?.end_date;
            // created_by = created_by ?? data?.created_by;
            // template = template ?? data?.template;

            string short_description = req.Form["short_description"];
            string start_date = req.Form["start_date"];
            string end_date = req.Form["end_date"];
            string created_by = req.Form["created_by"];
            string template = req.Form["template"];

            // Load settings and initialize GraphHelper with app only auth
            var settings = Settings.LoadSettings();

            try {
                var serviceNowHelper = new ServiceNowHelper(settings);

                // Initialize the ServiceNowHelper without the user's email address
                await serviceNowHelper.Init(string.Empty);

                // Get the change for the number
                var changes = await serviceNowHelper.CreateChange(new ChangeTicket()
                {
                    short_description = short_description,
                    start_date = start_date,
                    end_date = end_date
                });

                return new OkObjectResult(changes);

            }
            catch (Exception ex) {
                return new BadRequestObjectResult("Error connecting to Service Now: " + ex.Message);
            }
        }
    }
}
