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
    public static class GetChangeByNumber
    {
        [FunctionName("GetChangeByNumber")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string changeNo = req.Query["changeNo"];
            string debug = req.Query["debug"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            changeNo = changeNo ?? data?.changeNo;
            debug = debug ?? data?.debug;

            if (debug == "true") {
                return new OkObjectResult(new ServiceNowChangeTicketResponse 
                {
                    Result = new System.Collections.Generic.List<ChangeTicket>
                    {
                        new ChangeTicket
                        {
                            number = "CHG0000001",
                            short_description = "Test Change",
                            start_date = "02/07/2023 12:37:51",
                            end_date = "03/07/2023 12:37:51",
                            state = "1"
                        }
                    }
                });
            }

            // Load settings and initialize GraphHelper with app only auth
            var settings = Settings.LoadSettings();

            try {
                var serviceNowHelper = new ServiceNowHelper(settings);

                // Initialize the ServiceNowHelper without the user's email address
                await serviceNowHelper.Init(string.Empty);

                // Get the change for the number
                var changes = await serviceNowHelper.GetChangeFromNumber(changeNo);

                return new OkObjectResult(changes);

            }
            catch (Exception ex) {
                return new BadRequestObjectResult("Error connecting to Service Now: " + ex.Message);
            }
        }
    }
}
