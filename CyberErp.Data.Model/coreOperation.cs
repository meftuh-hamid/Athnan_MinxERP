//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CyberErp.Data.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class coreOperation
    {
        public coreOperation()
        {
            this.coreRolePermission = new HashSet<coreRolePermission>();
        }
    
        public System.Guid Id { get; set; }
        public System.Guid ModuleId { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsMenu { get; set; }
        public string Href { get; set; }
        public string IconCls { get; set; }
        public string UiId { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreModule coreModule { get; set; }
        public virtual ICollection<coreRolePermission> coreRolePermission { get; set; }
    }
}
