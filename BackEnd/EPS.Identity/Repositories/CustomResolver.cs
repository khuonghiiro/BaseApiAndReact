using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.Reflection;

namespace EPS.Identity.Repositories
{
    public class CustomResolver : DefaultContractResolver
    {
        protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
        {
            JsonProperty jsonProperty = base.CreateProperty(member, memberSerialization);
            if (jsonProperty.PropertyType.IsInterface || (jsonProperty.PropertyType.IsClass && jsonProperty.PropertyType != typeof(string)))
            {
                jsonProperty.ShouldSerialize = (object obj) => false;
            }

            return jsonProperty;
        }
    }
}
