using EPS.Identity.Repositories.Interface;

namespace EPS.Identity.BaseExt
{
    public abstract class TableGridInfo<Tkey> : IDeleteInfo<Tkey> where Tkey : struct
    {
        public DateTime? DeletedDate { get; set; }

        public Tkey? DeletedUserId { get; set; }
    }
}
