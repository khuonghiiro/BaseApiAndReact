using System.ComponentModel;
using System.Reflection;

namespace EPS.Identity.BaseExt
{
    public static class CommonHelper
    {
        public static string GetDescription(this object obj)
        {
            return obj.GetAttribute<DescriptionAttribute>()?.Description;
        }

        public static TAttribute GetAttribute<TAttribute>(this object obj) where TAttribute : Attribute
        {
            return obj.GetType().GetCustomAttributes(typeof(TAttribute), inherit: false).FirstOrDefault() as TAttribute;
        }

        public static string GetEnumDescription(this Enum enumValue)
        {
            return enumValue.GetEnumAttribute<DescriptionAttribute>()?.Description;
        }

        public static TAttribute GetEnumAttribute<TAttribute>(this Enum enumValue) where TAttribute : Attribute
        {
            MemberInfo memberInfo = enumValue.GetType().GetMember(enumValue.ToString()).FirstOrDefault();
            if (memberInfo != null)
            {
                return (TAttribute)memberInfo.GetCustomAttributes(typeof(TAttribute), inherit: false).FirstOrDefault();
            }

            return null;
        }
    }
}
