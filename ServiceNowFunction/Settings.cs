using System;

namespace groveale
{
    public class Settings
    {
        public string? ClientId { get; set; }
        public string? Domain { get; set; }
        public string? ClientSecret { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }

        public static Settings LoadSettings()
        {
            return new Settings 
            {
                Domain = Environment.GetEnvironmentVariable("ServiceNowDomain"),
                ClientId = Environment.GetEnvironmentVariable("ServiceNowclientId"),
                ClientSecret = Environment.GetEnvironmentVariable("ServiceNowclientSecret"),
                Username = Environment.GetEnvironmentVariable("ServiceNowUsername"),
                Password = Environment.GetEnvironmentVariable("ServiceNowPassword"),
            };
        }
    }
}