using System;
using System.Configuration;

namespace WebAPI.Helpers
{
    public class CustomConfig
    {
        public static string HEADERS = ConfigurationManager.AppSettings["Access-Control-Allow-Headers"];
        public static string METHODS = ConfigurationManager.AppSettings["Access-Control-Allow-Methods"];
        public static string ORIGINS = ConfigurationManager.AppSettings["Access-Control-Allow-Origin"];
        public static string EXPOSEDHEADERS = ConfigurationManager.AppSettings["Access-Control-Expose-Headers"];
        public static char SEPERATOR = Convert.ToChar(ConfigurationManager.AppSettings["SEPERATOR"]);
    }
}