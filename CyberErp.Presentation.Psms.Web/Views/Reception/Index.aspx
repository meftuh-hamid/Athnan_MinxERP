<%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Procurement and Supply chain Management System</title>
    <link rel="shortcut icon" href="<% = Url.Content("~/Content/images/app/favicon.ico") %>" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/ext-all.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/main.css") %>" rel="Stylesheet" />
    <link type="text/css" href="<% = Url.Content("~/Content/css/app/fileuploadfield.css") %>" rel="Stylesheet" />
   
     <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ext-base.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ext-base.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ext-all.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/tab-close-menu.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/CheckColumn.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/ux-util.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/array-tree.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/SystemMessage.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Ext/SystemMessageManager.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Login.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Reception.js") %>"></script>
    <script type="text/javascript" src="<% = Url.Content("~/Scripts/Common/Entry.js") %>"></script>
  
      <script type="text/javascript" src="<% = Url.Content("~/Direct/Api") %>"></script>
</head>
<body class='reception-body'>
    <form id="Form1" runat="server">
        <asp:ScriptManager ID="ScriptManagerMain" runat="server" EnableScriptGlobalization="true">
            <Scripts>
                <asp:ScriptReference Assembly="CyberErp.Language.Psms" Name="CyberErp.Language.Psms.Resource.js" />
            </Scripts>
        </asp:ScriptManager>
    </form>    
</body>
</html>
