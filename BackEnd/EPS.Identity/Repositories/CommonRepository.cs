﻿using EPS.Identity.Pages;
using EPS.Identity.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;
using System.Data;
using System.Linq.Expressions;
namespace EPS.Identity.Repositories
{
    public class CommonRepository<TContext, TUser, TUserKey> : ICommonRepository, IDisposable
    where TContext : DbContext, new()
    where TUser : class
    where TUserKey : struct
    {
        protected TContext _dbContext;

        protected ILogger _logger;

        protected IUserIdentity<TUserKey> _currentUser;

        private static JsonSerializerSettings _jsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new CustomResolver(),
            PreserveReferencesHandling = PreserveReferencesHandling.None,
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            Formatting = Formatting.Indented
        };

        public CommonRepository(TContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual IQueryable<TEntity> All<TEntity>() where TEntity : class
        {
            return _dbContext.Set<TEntity>();
        }

        public virtual IQueryable<TEntity> FromSqlRaw<TEntity>(string sql, params object[] parameters) where TEntity : class
        {
            return _dbContext.Set<TEntity>().FromSqlRaw(sql, parameters);
        }

        public virtual int Count<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return _dbContext.Set<TEntity>().WhereMany(predicates).Count();
        }

        public virtual async Task<int> CountAsync<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return await _dbContext.Set<TEntity>().WhereMany(predicates).CountAsync();
        }

        public virtual TEntity Find<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return _dbContext.Set<TEntity>().WhereMany(predicates).FirstOrDefault();
        }

        public virtual TEntity Find<TEntity>(object id) where TEntity : class
        {
            if (id is object[])
            {
                TEntity val = _dbContext.Set<TEntity>().Find(id as object[]);
                if (val is IDeleteInfo<int> && (val as IDeleteInfo<int>).DeletedUserId.HasValue)
                {
                    throw new Exception("Invalid Id");
                }

                return val;
            }

            TEntity val2 = _dbContext.Set<TEntity>().Find(id);
            if (val2 is IDeleteInfo<int> && (val2 as IDeleteInfo<int>).DeletedUserId.HasValue)
            {
                throw new Exception("Invalid Id");
            }

            return val2;
        }

        public virtual async Task<TEntity> FindAsync<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return await _dbContext.Set<TEntity>().WhereMany(predicates).FirstOrDefaultAsync();
        }

        public virtual async Task<TEntity> FindAsync<TEntity>(object id) where TEntity : class
        {
            if (id is object[])
            {
                TEntity val = await _dbContext.Set<TEntity>().FindAsync(id as object[]);
                if (val is IDeleteInfo<int> && (val as IDeleteInfo<int>).DeletedUserId.HasValue)
                {
                    throw new Exception("Invalid Id");
                }

                return val;
            }

            TEntity val2 = await _dbContext.Set<TEntity>().FindAsync(id);
            if (val2 is IDeleteInfo<int> && (val2 as IDeleteInfo<int>).DeletedUserId.HasValue)
            {
                throw new Exception("Invalid Id");
            }

            return val2;
        }

        public virtual IQueryable<TEntity> Filter<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return _dbContext.Set<TEntity>().WhereMany(predicates);
        }

        public bool Contain<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return _dbContext.Set<TEntity>().WhereMany(predicates).Any();
        }

        public async Task<bool> ContainAsync<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            return await _dbContext.Set<TEntity>().WhereMany(predicates).AnyAsync();
        }

        public virtual void Create<TEntity>(params TEntity[] entities) where TEntity : class
        {
            foreach (TEntity entity in entities)
            {
                _dbContext.Set<TEntity>().Add(entity);
            }

            _dbContext.SaveChanges();
        }

        public virtual async Task CreateAsync<TEntity>(params TEntity[] entities) where TEntity : class
        {
            foreach (TEntity entity in entities)
            {
                _dbContext.Set<TEntity>().Add(entity);
            }

            await _dbContext.SaveChangesAsync();
        }

        public virtual int Delete<TEntity, TKey>(TKey id) where TEntity : class
        {
            TEntity entity = Find<TEntity>(id);
            return Delete(entity);
        }

        public virtual int Delete<TEntity, TKey>(TKey[] ids) where TEntity : class
        {
            foreach (TKey val in ids)
            {
                TEntity val2 = Find<TEntity>(val);

                if (val2 is ICascadeDelete)
                {
                    (val2 as ICascadeDelete).OnDelete();
                }

                if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
                {
                    AddDeleteInfo(val2);
                }
                else
                {
                    _dbContext.Set<TEntity>().Remove(val2);
                }
            }

            return _dbContext.SaveChanges();
        }

        public virtual int Delete<TEntity>(TEntity entity) where TEntity : class
        {
            if (entity is ICascadeDelete)
            {
                (entity as ICascadeDelete).OnDelete();
            }

            if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
            {
                AddDeleteInfo(entity);
            }
            else
            {
                _dbContext.Set<TEntity>().Remove(entity);
            }

            return _dbContext.SaveChanges();
        }

        public virtual int Delete<TEntity>(TEntity[] entities) where TEntity : class
        {
            foreach (TEntity val in entities)
            {
                if (val is ICascadeDelete)
                {
                    (val as ICascadeDelete).OnDelete();
                }

                if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
                {
                    AddDeleteInfo(val);
                }
                else
                {
                    _dbContext.Set<TEntity>().Remove(val);
                }
            }

            return _dbContext.SaveChanges();
        }

        public virtual int Delete<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            TEntity[] array = Filter(predicates).ToArray();
            TEntity[] array2 = array;
            foreach (TEntity val in array2)
            {
                if (val is ICascadeDelete)
                {
                    (val as ICascadeDelete).OnDelete();
                }

                if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
                {
                    AddDeleteInfo(val);
                }
                else
                {
                    _dbContext.Set<TEntity>().Remove(val);
                }
            }

            return _dbContext.SaveChanges();
        }

        public virtual async Task<int> DeleteAsync<TEntity, TKey>(TKey id) where TEntity : class
        {
            return await DeleteAsync(await FindAsync<TEntity>(id));
        }

        public virtual async Task<int> DeleteAsync<TEntity, TKey>(params TKey[] ids) where TEntity : class
        {
            foreach (TKey val in ids)
            {
                TEntity val2 = await FindAsync<TEntity>(val);

                if (val2 is ICascadeDelete)
                {
                    (val2 as ICascadeDelete).OnDelete();
                }

                if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
                {
                    AddDeleteInfo(val2);
                }
                else
                {
                    _dbContext.Set<TEntity>().Remove(val2);
                }
            }

            return await _dbContext.SaveChangesAsync();
        }

        public virtual async Task<int> DeleteAsync<TEntity>(TEntity entity) where TEntity : class
        {
            if (entity is ICascadeDelete)
            {
                (entity as ICascadeDelete).OnDelete();
            }

            if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
            {
                AddDeleteInfo(entity);
            }
            else
            {
                _dbContext.Set<TEntity>().Remove(entity);
            }

            return await _dbContext.SaveChangesAsync();
        }

        public virtual async Task<int> DeleteAsync<TEntity>(params TEntity[] entities) where TEntity : class
        {
            foreach (TEntity val in entities)
            {
                if (val is ICascadeDelete)
                {
                    (val as ICascadeDelete).OnDelete();
                }

                if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
                {
                    AddDeleteInfo(val);
                }
                else
                {
                    _dbContext.Set<TEntity>().Remove(val);
                }
            }

            return await _dbContext.SaveChangesAsync();
        }

        public virtual async Task<int> DeleteAsync<TEntity>(params Expression<Func<TEntity, bool>>[] predicates) where TEntity : class
        {
            TEntity[] array = await Filter(predicates).ToArrayAsync();
            foreach (TEntity val in array)
            {
                // Kiểm tra xem thực thể có implement interface ICascadeDelete.
                if (val is ICascadeDelete)
                {
                    (val as ICascadeDelete).OnDelete();
                }

                // Kiểm tra xem TEntity có implement interface IDeleteInfo<TUserKey>.
                if (typeof(IDeleteInfo<TUserKey>).IsAssignableFrom(typeof(TEntity)))
                {
                    AddDeleteInfo(val);
                }
                else
                {
                    _dbContext.Set<TEntity>().Remove(val);
                }
            }

            return await _dbContext.SaveChangesAsync();
        }

        public virtual int Update<TEntity>(params TEntity[] entities) where TEntity : class
        {
            foreach (TEntity entity in entities)
            {
                EntityEntry<TEntity> entityEntry = _dbContext.Entry(entity);

                AddUpdateInfo(entity);
            }

            return _dbContext.SaveChanges();
        }

        public virtual async Task<int> UpdateAsync<TEntity>(params TEntity[] entities) where TEntity : class
        {
            foreach (TEntity entity in entities)
            {
                _dbContext.Entry(entity);

                AddUpdateInfo(entity);
            }

            return await _dbContext.SaveChangesAsync();
        }

        public virtual void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public virtual async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public virtual int ExecuteNonQuery(string sql, params object[] sqlParams)
        {
            return _dbContext.Database.ExecuteSqlRaw(sql, sqlParams);
        }

        public TDbContext GetDbContext<TDbContext>() where TDbContext : class
        {
            return _dbContext as TDbContext;
        }

        public virtual IDbContextTransaction BeginTransaction()
        {
            return _dbContext.Database.BeginTransaction();
        }

        public virtual IDbContextTransaction BeginTransaction(IsolationLevel isolationLevel)
        {
            return _dbContext.Database.BeginTransaction(isolationLevel);
        }

        public void Dispose()
        {
            if (_dbContext != null)
            {
                _dbContext.Dispose();
                _dbContext = null;
            }
        }

        private void AddCreateInfo<TEntity>(TEntity entity)
        {
            if (entity is ICreateInfo<TUserKey>)
            {
                ((ICreateInfo<TUserKey>)(object)entity).CreatedDate = DateTime.Now;
                ((ICreateInfo<TUserKey>)(object)entity).CreatedUserId = _currentUser.UserId;
            }
        }

        private void AddUpdateInfo<TEntity>(TEntity entity)
        {
            if (entity is IUpdateInfo<TUserKey>)
            {
                ((IUpdateInfo<TUserKey>)(object)entity).LastUpdatedDate = DateTime.Now;
                ((IUpdateInfo<TUserKey>)(object)entity).LastUpdatedUserId = _currentUser.UserId;
            }
        }

        private void AddDeleteInfo<TEntity>(TEntity entity)
        {
            if (entity is IDeleteInfo<TUserKey>)
            {
                ((IDeleteInfo<TUserKey>)(object)entity).DeletedDate = DateTime.Now;
                ((IDeleteInfo<TUserKey>)(object)entity).DeletedUserId = _currentUser.UserId;
                //((IDeleteInfo<TUserKey>)(object)entity).IsDeleted = true;
            }
        }
    }
}
