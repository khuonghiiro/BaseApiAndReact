using System.ComponentModel;

namespace EPS.Identity.BaseExt
{
    
    public class CommonException : ApplicationException
    {
        public CommonException(EPSExceptionCode code, params object[] args)
            : base(string.Format(code.GetEnumDescription(), args))
        {
        }

        public CommonException(string message)
            : base(message)
        {
        }
    }

    public enum EPSExceptionCode
    {
        [Description("Không thể xóa {0} do có dữ liệu liên quan.")]
        DeleteRecordWithRelatedData = 1
    }
}
