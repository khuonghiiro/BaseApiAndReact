using EPS.Identity.Pages;
using System.Linq.Expressions;
namespace EPS.Identity.Dtos.UserAccountSetting
{
    /// <summary>
    /// GridPaging Cấu hình truy cập hệ thống
    /// </summary>
    ///<author>KhuongPV</author>
    ///<created>09-09-2024</created>
    public class UserAccountSettingGridPaging : PagingParams<UserAccountSettingGridDto>
    {
        public string? FilterText { get; set; }
        public int? maxInactivityTimeout { get; set; }
        public int? maxFailedLoginAttempts { get; set; }
        public int? accountLockoutDuration { get; set; }
        public string? accessTimeStartFrom { get; set; }
        public string? accessTimeStartTo { get; set; }
        public string? accessTimeEndFrom { get; set; }
        public string? accessTimeEndTo { get; set; }
        public int? accountSuspensionPeriod { get; set; }
        public string? serviceAccessRestrictions { get; set; }
        public int? loginHistoryRetention { get; set; }
        public bool isAccountAutoDelete { get; set; }
        public int? accessFailedCount { get; set; }
        public bool lockoutEnabled { get; set; }
        //rendercode{5}
        public override List<Expression<Func<UserAccountSettingGridDto, bool>>> GetPredicates()
        {
            var predicates = base.GetPredicates();
            if (!string.IsNullOrEmpty(FilterText))
                predicates.Add(x => (x.ServiceAccessRestrictions.Contains(FilterText.Trim())));
            if (maxInactivityTimeout > 0)
            {
                predicates.Add(x => (x.MaxInactivityTimeout.Equals(maxInactivityTimeout)));
            }

            if (maxFailedLoginAttempts > 0)
            {
                predicates.Add(x => (x.MaxFailedLoginAttempts.Equals(maxFailedLoginAttempts)));
            }

            if (accountLockoutDuration > 0)
            {
                predicates.Add(x => (x.AccountLockoutDuration.Equals(accountLockoutDuration)));
            }

            //if (!String.IsNullOrWhiteSpace(accessTimeStartFrom))
            //{
            //    CultureInfo provider = CultureInfo.InvariantCulture;
            //    DateTime _accessTimeStartFrom;
            //    if (DateTime.TryParseExact(accessTimeStartFrom, "yyyy-MM-dd", provider, DateTimeStyles.None, out _accessTimeStartFrom))
            //    {
            //        predicates.Add(x => x.AccessTimeStart >= _accessTimeStartFrom);
            //    }
            //}
            //if (!String.IsNullOrWhiteSpace(accessTimeStartTo))
            //{
            //    CultureInfo provider = CultureInfo.InvariantCulture;
            //    DateTime _accessTimeStartTo;
            //    if (DateTime.TryParseExact(accessTimeStartTo, "yyyy-MM-dd", provider, DateTimeStyles.None, out _accessTimeStartTo))
            //    {
            //        var nextday = _accessTimeStartTo.AddDays(1);
            //        predicates.Add(x => x.AccessTimeStart <= nextday);
            //    }
            //}
            //if (!String.IsNullOrWhiteSpace(accessTimeEndFrom))
            //{
            //    CultureInfo provider = CultureInfo.InvariantCulture;
            //    DateTime _accessTimeEndFrom;
            //    if (DateTime.TryParseExact(accessTimeEndFrom, "yyyy-MM-dd", provider, DateTimeStyles.None, out _accessTimeEndFrom))
            //    {
            //        predicates.Add(x => x.AccessTimeEnd >= _accessTimeEndFrom);
            //    }
            //}
            //if (!String.IsNullOrWhiteSpace(accessTimeEndTo))
            //{
            //    CultureInfo provider = CultureInfo.InvariantCulture;
            //    DateTime _accessTimeEndTo;
            //    if (DateTime.TryParseExact(accessTimeEndTo, "yyyy-MM-dd", provider, DateTimeStyles.None, out _accessTimeEndTo))
            //    {
            //        var nextday = _accessTimeEndTo.AddDays(1);
            //        predicates.Add(x => x.AccessTimeEnd <= nextday);
            //    }
            //}
            if (accountSuspensionPeriod > 0)
            {
                predicates.Add(x => (x.AccountSuspensionPeriod.Equals(accountSuspensionPeriod)));
            }

            if (!string.IsNullOrEmpty(serviceAccessRestrictions))
            {
                predicates.Add(x => (x.ServiceAccessRestrictions.Contains(serviceAccessRestrictions.Trim())));
            }

            if (loginHistoryRetention > 0)
            {
                predicates.Add(x => (x.LoginHistoryRetention.Equals(loginHistoryRetention)));
            }
            if (accessFailedCount > 0)
            {
                predicates.Add(x => (x.AccessFailedCount.Equals(accessFailedCount)));
            }
            //rendercode{6}
            return predicates;
        }
    }
}
