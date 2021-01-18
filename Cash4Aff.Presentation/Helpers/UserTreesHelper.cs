using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Cash4Aff.Presentation.Helpers
{
    public static class UserTreesHelper
    {
        #region build tree to jstree
        public static List<TreeGridViewModels> BuildTree(DataTable Data, string id)
        {
            return PopulateRootLevel(Data, id);
        }

        private static List<TreeGridViewModels> PopulateRootLevel(DataTable data, string id)
        {
            List<TreeGridViewModels> obJdata = new List<TreeGridViewModels>();
            PopulateNodes(data, obJdata, id);
            return obJdata;
        }
        private static void PopulateNodes(DataTable dt, List<TreeGridViewModels> items, string id)
        {
            //lấy ra level 0
            foreach (DataRow item in dt.Rows)
            {
                if (item["ID"].ToString() == id)
                {
                    TreeGridViewModels mi = new TreeGridViewModels
                    {
                        id = item["ID"].ToString(),
                        parent = "#",
                        text = item["Name"].ToString(),
                        state = new State { opened = true }
                    };
                    items.Add(mi);
                    var x = dt.Select("ParentUserID = '" + item["ID"].ToString() + "'");
                    menuCreate(items, dt.Select("ParentUserID = '" + item["ID"].ToString() + "'").Length > 0 ? dt.Select("ParentUserID = '" + item["ID"].ToString() + "'").CopyToDataTable() : new DataTable(), dt);
                }
            }
        }
        private static void menuCreate(List<TreeGridViewModels> tree, DataTable dataChild, DataTable data)
        {
            foreach (DataRow item in dataChild.Rows)
            {
                TreeGridViewModels mi = new TreeGridViewModels
                {
                    id = item["ID"].ToString(),
                    parent = item["ParentUserID"].ToString(),
                    text = item["Name"].ToString()
                };
                tree.Add(mi);
                menuCreate(tree, data.Select("ParentUserID = '" + item["ID"].ToString() + "'").Length > 0 ? data.Select("ParentUserID = '" + item["ID"].ToString() + "'").CopyToDataTable() : new DataTable(), data);
            }
        }
        #endregion
    }

    public class TreeGridViewModels
    {
        public string id { get; set; }
        public string parent { get; set; }
        public string text { get; set; }
        public string icon { get; set; }
        public State state { get; set; }
        public bool opened { get; set; }
        public bool disabled { get; set; }
        public bool selected { get; set; }
        public string li_attr { get; set; }
        public string a_attr { get; set; }
        public bool IsHide { get; set; }
        public int? Level { get; set; }
    }
    public class State
    {
        public string selected { get; set; }
        public bool @checked { get; set; }
        public bool opened { get; set; }
    }

    public class TreeViewModels
    {
        public string id { get; set; }
        public string text { get; set; }
        public string Description { get; set; }
        public string UpdatedFullName { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool? IsActived { get; set; }
        public int? Level { get; set; }
        public string NodeTree { get; set; }
        public List<TreeViewModels> children { get; set; }
    }
}