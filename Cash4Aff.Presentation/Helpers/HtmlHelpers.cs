using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cash4Aff.Presentation.Helpers
{
    public static class HtmlHelpers
    {
        /// <summary>
        /// Returns a checkbox for each of the provided <paramref name="items"/>.
        /// </summary>
        public static MvcHtmlString CheckBoxListFor<TModel, TValue>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TValue>> expression, List<SelectListItem> items, object htmlAttributes = null)
        {
            var listName = ExpressionHelper.GetExpressionText(expression);

            return htmlHelper.CheckBoxList(listName, items, htmlAttributes);
        }

        /// <summary>
        /// Stolen from Ben: https://github.com/benfoster/Fabrik.Common/blob/master/src/Fabrik.Common.Web/HtmlHelperExtensions.cs
        /// Returns a checkbox for each of the provided <paramref name="items"/>.
        /// </summary>
        public static MvcHtmlString CheckBoxList(this HtmlHelper htmlHelper, string listName, List<SelectListItem> items, object htmlAttributes = null)
        {
            var container = new TagBuilder("ul");
            container.MergeAttributes(new RouteValueDictionary(htmlAttributes), true);
            foreach (var item in items)
            {
                var li = new TagBuilder("li");
                var label = new TagBuilder("label");

                var cb = new TagBuilder("input");
                cb.MergeAttribute("type", "checkbox");
                cb.MergeAttribute("name", listName);
                cb.MergeAttribute("value", item.Value ?? item.Text);
                if (item.Selected)
                {
                    cb.MergeAttribute("checked", "checked");
                }

                label.InnerHtml = cb.ToString(TagRenderMode.SelfClosing) + item.Text;
                li.InnerHtml = label.ToString();

                container.InnerHtml += li.ToString();
            }

            return new MvcHtmlString(container.ToString());
        }

        public static DataTable ToDataTable<T>(this IList<T> data)
        {
            DataTable table = new DataTable();
            if (typeof(T) == typeof(int))
            {
                table.Columns.Add("IntValue", typeof(int));
                if (data == null)
                    return table;
                foreach (T item in data)
                {
                    DataRow row = table.NewRow();
                    row["IntValue"] = item;
                    table.Rows.Add(row);
                }
                return table;
            }
            else if (typeof(T) == typeof(string))
            {
                table.Columns.Add("StringValue", typeof(string));
                if (data == null)
                    return table;
                foreach (T item in data)
                {
                    DataRow row = table.NewRow();
                    row["StringValue"] = item;
                    table.Rows.Add(row);
                }
                return table;
            }
            else if (typeof(T) == typeof(decimal))
            {
                table.Columns.Add("DecimalValue", typeof(decimal));
                if (data == null)
                    return table;
                foreach (T item in data)
                {
                    DataRow row = table.NewRow();
                    row["DecimalValue"] = item;
                    table.Rows.Add(row);
                }
                return table;
            }
            else
            {

                DataTable dataTable = new DataTable(typeof(T).Name);

                //Get all the properties
                PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                foreach (PropertyInfo prop in Props)
                {
                    //Defining type of data column gives proper data table 
                    var type = (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) ? Nullable.GetUnderlyingType(prop.PropertyType) : prop.PropertyType);
                    //Setting column names as Property names
                    dataTable.Columns.Add(prop.Name, type);
                }
                if (data != null)
                    foreach (T item in data)
                    {
                        var values = new object[Props.Length];
                        for (int i = 0; i < Props.Length; i++)
                        {
                            //inserting property values to datatable rows
                            values[i] = Props[i].GetValue(item, null);
                        }
                        dataTable.Rows.Add(values);
                    }
                //put a breakpoint here and check datatable
                return dataTable;
            }
        }

    }
}