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
    
    public partial class psmsTransportation
    {
        public System.Guid Id { get; set; }
        public System.Guid FiscalYearId { get; set; }
        public Nullable<System.Guid> ItemId { get; set; }
        public Nullable<System.Guid> SupplierId { get; set; }
        public string VoucherNumber { get; set; }
        public System.DateTime Date { get; set; }
        public bool IsOwnedVehicle { get; set; }
        public string Location { get; set; }
        public Nullable<decimal> UnitCost { get; set; }
        public string ATC { get; set; }
        public Nullable<System.Guid> UnitId { get; set; }
        public Nullable<decimal> Quantity { get; set; }
        public string DriverName { get; set; }
        public string DriverTelephone { get; set; }
        public string PlateNo { get; set; }
        public string LicenseNo { get; set; }
        public System.Guid PreparedById { get; set; }
        public string ShipperName { get; set; }
        public string ReceivedBy { get; set; }
        public System.Guid StatusId { get; set; }
        public string Remark { get; set; }
        public bool IsDeleted { get; set; }
        public byte[] LastUpdated { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
    
        public virtual coreFiscalYear coreFiscalYear { get; set; }
        public virtual coreUser coreUser { get; set; }
        public virtual lupMeasurementUnit lupMeasurementUnit { get; set; }
        public virtual lupVoucherStatus lupVoucherStatus { get; set; }
        public virtual psmsItem psmsItem { get; set; }
        public virtual psmsSupplier psmsSupplier { get; set; }
    }
}