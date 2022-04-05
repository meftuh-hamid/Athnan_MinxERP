namespace CyberErp.Presentation.Psms.Web.Classes
{
    public class Permission
    {
        public string User { get; set; }
        public string Role { get; set; }
        public string Operation { get; set; }
        public string Href { get; set; }
        public bool CanAdd { get; set; }
        public bool CanEdit { get; set; }
        public bool CanDelete { get; set; }
        public bool CanView { get; set; }
        public bool CanApprove { get; set; }
        public bool CanCertify { get; set; }
    }
}