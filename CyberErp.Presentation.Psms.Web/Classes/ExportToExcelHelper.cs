using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace CyberErp.Presentation.Psms.Web.Classes
{
    public class ExportToExcelHelper
    {
        public void ToExcel(HttpResponseBase Response, object list)
        {
            string newFileName = GuidEncoder.Encode(Guid.NewGuid()) + ".xls";

            var grid = new System.Web.UI.WebControls.GridView();
            grid.DataSource = list;
            grid.DataBind();
            Response.ClearContent();
            Response.AddHeader("content-disposition", "attachment; filename=" + newFileName);
            Response.ContentType = "application/excel";
            StringWriter sw = new StringWriter();
            HtmlTextWriter htw = new HtmlTextWriter(sw);

            grid.RenderControl(htw);
            Response.Write(sw.ToString());
            Response.End();
        }
    }
}