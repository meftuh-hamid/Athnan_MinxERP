using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CyberErp.Data.Model
{
  public class ItemCostModel
    {
      public Guid Id { get; set; }
      public Guid ItemId { get; set; }
      public decimal UnitCost { get; set; }
      public decimal Quantity { get; set; }
    }
}
