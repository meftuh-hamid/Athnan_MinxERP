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
    
    public partial class slmsDailySales
    {
        public System.Guid Id { get; set; }
        public System.Guid StoreId { get; set; }
        public System.DateTime Date { get; set; }
        public decimal SalesAmount { get; set; }
        public decimal Expense { get; set; }
        public decimal BankDeposite { get; set; }
        public decimal SalesReturnAMount { get; set; }
        public decimal UnDepositedAmount { get; set; }
        public decimal Difference { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public System.DateTime CreatedAt { get; set; }
    
        public virtual psmsStore psmsStore { get; set; }
    }
}