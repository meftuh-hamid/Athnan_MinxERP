using CyberErp.Data.Model;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CyberErp.Business.Component.Psms
{
    public class Item : BaseModel<psmsItem>
    {
        private readonly DbContext _dbContext;
        private readonly BaseModel<psmsSetting> _setting;
        private readonly BaseModel<psmsItemCategory> _itemCategory;

        public Item(DbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
            _setting = new BaseModel<psmsSetting>(dbContext);
            _itemCategory = new BaseModel<psmsItemCategory>(_dbContext);
        }
        public string GenerateItemCode(Guid itemCategoryId,string settingName)
        {
            string code = "";
         
            var setting = _setting.GetAll().Where(o => o.Name == settingName).FirstOrDefault();
            if (setting==null)throw new System.InvalidOperationException("No setting, please check inventory setting for the auto-generation item code!");
            if (setting.Value == "false")return code;
            var itemCategory = _itemCategory.Get(o => o.Id == itemCategoryId);
            var lastItem = this.GetAll().AsQueryable().Where(o => o.ItemCategoryId == itemCategoryId).OrderByDescending(o => o.Code).FirstOrDefault();
            var maximumCode =lastItem!=null? lastItem.Code:"";
            string[] lastString = maximumCode != null ? maximumCode.Split('-') : null;
            var lastNumber = lastString != null ? lastString.Last() : "";
            if (lastNumber == "") lastNumber = "0";

            var format = GetFormat(3);
            var itemCount = int.Parse(lastNumber) + 1;
            var codeNumber = string.Format(format, itemCount);
            code = (lastItem!=null?lastString.First() :itemCategory.Code) + "-" + codeNumber;

            return code;
                 
        }
        public string GetFormat(int numberOfDigits)
        {
            var format = "{0:";
            for (var i = 0; i < numberOfDigits; i++)
            {
                format += "0";
            }
            format += "}";
            return format;
        }
    
    }
}
