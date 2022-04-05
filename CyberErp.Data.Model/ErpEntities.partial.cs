using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Data.Model
{
    public partial class ErpEntities : DbContext
    {
        public ErpEntities(String connectionString)
            : base(connectionString)
        {

        }
    }
}
