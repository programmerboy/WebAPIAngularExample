using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using WebAPI.Helpers;

namespace WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private  bool ValidateRequest(string origin, out string matchedOrigin)
        {
            var boolFound = false;
            var foundOrigin = string.Empty;

            var whitelistOrigins = CustomConfig.ORIGINS.Replace(" ", "").Split(CustomConfig.SEPERATOR);
            foreach (var item in whitelistOrigins)
            {
                if (origin.ExactMatch(item))
                {
                    boolFound = true;
                    foundOrigin = item.ToLower();
                    break;
                }
            }
            matchedOrigin = foundOrigin;
            return boolFound;
        }

        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

        private string _matchedOrigin;
        private string _requestOrigin;

        protected void Application_BeginRequest()
        {
            _requestOrigin = Request.Headers["Origin"];

            if (ValidateRequest(_requestOrigin, out _matchedOrigin) && Request.Headers.AllKeys.Contains("Origin") && Request.HttpMethod == "OPTIONS")
            {
                var headers = CustomConfig.HEADERS.Split(',').ToList();
                headers.Add("X-Auth-Token");

                Response.StatusCode = (int)HttpStatusCode.OK;
                Response.Headers.Add("Access-Control-Allow-Credentials", "true");
                Response.Headers.Add("Access-Control-Allow-Origin", _matchedOrigin);
                Response.Headers.Add("Access-Control-Allow-Methods", CustomConfig.METHODS);
                Response.Headers.Add("Access-Control-Allow-Headers", CustomConfig.HEADERS);
                //Response.Headers.Add("Access-Control-Allow-Headers", string.Join(", ", headers.ToArray()));
                //Response.Headers.Add("Access-Control-Expose-Headers", "X-Auth-Token");
                Response.Flush();

                //Response.Flush();
                //Response.End(); //Send the Empty Response for Options (Preflight Request)

            }

            //http://stackoverflow.com/questions/21999409/web-api-2-session
            //This is to enable sessions. If sessions are not required then remove following line
            //HttpContext.Current.SetSessionStateBehavior(System.Web.SessionState.SessionStateBehavior.Required);

        }
    }
}
