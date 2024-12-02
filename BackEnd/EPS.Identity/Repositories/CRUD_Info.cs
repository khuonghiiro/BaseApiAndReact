using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPS.Identity.Repositories.Interface; 
using EPS.Identity.Pages; 
using EPS.Identity.Authorize;
using EPS.Identity.BaseExt.Interface;

namespace EPS.Identity.Repositories
{
    public abstract class CRUD_Info<Tkey> : IDeleteInfo<int>, ICreateInfo<int>, IUpdateInfo<int> where Tkey : struct
    {
        public DateTime? DeletedDate { get; set; }

        public int? DeletedUserId { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public int? LastUpdatedUserId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedUserId { get; set; }

        public Tkey Id { get; set; }
    }
}
