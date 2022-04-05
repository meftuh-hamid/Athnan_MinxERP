<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ErpReportViewer.aspx.cs" Inherits="ReportEngine.Reports.ErpReportViewer" %>

<%@ Register Assembly="CrystalDecisions.Web, Version=13.0.2000.0, Culture=neutral, PublicKeyToken=692fbea5521e1304"
    Namespace="CrystalDecisions.Web" TagPrefix="CR" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Purchasing and Supply Management System</title>
    <link type="text/css" href="../Content/css/reportviewer.css" rel = "Stylesheet" />
    <script type="text/javascript">
        function Print() {
            var dvReport = document.getElementById("dvReport");
            var frame1 = dvReport.getElementsByTagName("iframe")[0];
            if (navigator.appName.indexOf("Internet Explorer") != -1) {
                frame1.name = frame1.id;
                window.frames[frame1.id].focus();
                window.frames[frame1.id].print();
            }
            else {
                var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
                frameDoc.print();
            }
        }
</script>
</head>
<body>
    <form id="form1" runat="server">
        <input type="button" id="btnPrint" value="Direct Print" onclick="Print()" />
      <div id="dvReport">
        
           <asp:Panel runat="server" ID="pnlReport">
            <CR:CrystalReportViewer ID="reportViewer" runat="server" AutoDataBind="true" BorderStyle="None" DisplayStatusbar="false" BackColor="Transparent" PrintMode="ActiveX" />
            <%--<CR:CrystalReportViewer ID="reportViewer" runat="server" AutoDataBind="true" BorderStyle="None" DisplayStatusbar="false" BackColor="Transparent" />--%>
        </asp:Panel>
     </div>
    </form>
</body>
</html>
