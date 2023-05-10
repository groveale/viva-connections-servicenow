using System;
using System.Collections.Generic;

namespace groveale
{


    public class User
    {
        public string user_name  { get; set; }
        public string email { get; set; }
        public string sys_id { get; set; }
    }

    public class UserApiResponse
    {
        public List<User> result { get; set; }
    }

    public class TokenResponse
    {
        public string access_token { get; set; }
        public string refresh_token { get; set; }
        public string scope { get; set; }
        public string token_type { get; set; }
        public int expires_in { get; set; }
    }

    public class Incident
    {
        public string number { get; set; }
        public string short_description { get; set; }
        public string caller_id { get; set; }
        public DateTime sys_updated_on { get; set; }
        public string LastUpdatedString { get; set; }
        public string category { get; set; }
    }

    public class IncidentResponse
    {
        public string number { get; set; }
        public string short_description { get; set; }
        public DateTime sys_updated_on { get; set; }
        public string category { get; set; }
    }

    public class IncidentApiResponse
    {
        public List<Incident> result { get; set; }
    }

    public class IncidentCreateApiResponse
    {
        public IncidentResponse result { get; set; }
    }

    public class AssignedTo
    {
        public string display_value { get; set; }
        public string link { get; set; }
    }

    public class AssignmentGroup
    {
        public string display_value { get; set; }
        public string link { get; set; }
    }

    public class ChangeTicket
    {
        public string end_date { get; set; }
        public string number { get; set; }
        public string short_description { get; set; }
        public AssignmentGroup assignment_group { get; set; }
        public UOwnerGroup u_owner_group { get; set; }
        public string state { get; set; }
        public string type { get; set; }
        public AssignedTo assigned_to { get; set; }
        public string start_date { get; set; }
    }


    public class UOwnerGroup
    {
        public string display_value { get; set; }
        public string link { get; set; }
    }

    public class ServiceNowChangeTicketResponse
    {
        public List<ChangeTicket> Result { get; set; }
    }
}