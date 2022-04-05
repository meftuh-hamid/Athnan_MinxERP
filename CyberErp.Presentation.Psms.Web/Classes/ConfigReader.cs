using System.Configuration;

namespace CyberErp.Presentation.Psms.Web.Classes
{
    public static class ConfigReader
    {
        public static string GetConnectionString(string key)
        {
            return ConfigurationManager.ConnectionStrings[key].ConnectionString;
        }
    }
}