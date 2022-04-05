using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class Store : BaseModel<psmsStore>
    {
        public Store(DbContext dbContext)
            : base(dbContext)
        {

        }

    }
}
