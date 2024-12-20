using AutoMapper;
using AutoMapper.Internal;
using AutoMapper.QueryableExtensions;
using EPS.Identity.BaseExt.Interface;
using EPS.Identity.Pages;
using EPS.Identity.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Data;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
namespace EPS.Identity.BaseExt
{
    public class BaseService : IBaseService, IDisposable
    {
        protected ICommonRepository _repository;
        protected IMapper _mapper;

        public BaseService(ICommonRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        /// <summary>
        /// Lấy danh sách với phân trang dựa trên tiêu chí lọc.
        /// </summary>
        public async Task<PagingResult<TDto>> FilterPagedAsync<TEntity, TDto>(
            PagingParams<TDto> pagingParams,
            params Expression<Func<TDto, bool>>[] predicates
        ) where TEntity : class
        {
            if (pagingParams == null)
            {
                throw new ArgumentNullException(nameof(pagingParams));
            }

            var result = new PagingResult<TDto>
            {
                PageSize = pagingParams.ItemsPerPage,
                CurrentPage = pagingParams.Page
            };

            // Bắt đầu từ truy vấn gốc của entity
            IQueryable<TEntity> entityQuery = _repository.Filter<TEntity>();

            if (entityQuery == null)
            {
                entityQuery = Enumerable.Empty<TEntity>().AsQueryable();
            }

            // Dự phòng cho các truy vấn phụ (nếu có)
            IQueryable<TDto> query = entityQuery.ProjectTo<TDto>(_mapper.ConfigurationProvider);

            if (query == null)
            {
                query = Enumerable.Empty<TDto>().AsQueryable();
            }

            // Lọc theo các predicate từ các tham số truyền vào
            var pagingPredicates = pagingParams.GetPredicates();
            if (pagingPredicates != null && pagingPredicates.Any())
            {
                query = query.WhereMany(pagingPredicates);
            }

            if (predicates != null && predicates.Any())
            {
                query = query.WhereMany(predicates);
            }

            // Lấy tổng số dòng trước khi áp dụng phân trang
            result.TotalRows = await query.CountAsync();

            // Áp dụng sắp xếp nếu có
            if (!string.IsNullOrEmpty(pagingParams.SortExpression))
            {
                if (pagingParams.SortBy == "NEWID")  // Đối với "NEWID" thì sắp xếp ngẫu nhiên
                {
                    query = query.OrderBy(x => Guid.NewGuid());
                }
                else
                {
                    query = query.OrderBy(pagingParams.SortExpression);  // Sắp xếp theo biểu thức truyền vào
                }
            }

            // Áp dụng phân trang
            if (pagingParams.Start > 0)
            {
                query = query.Skip(pagingParams.Start);
            }
            else if (pagingParams.StartingIndex > 0)  // Dự phòng cho StartingIndex
            {
                query = query.Skip(pagingParams.StartingIndex);
            }

            // Kiểm tra lại ItemsPerPage để đảm bảo đúng giá trị
            if (pagingParams.ItemsPerPage != -1 && pagingParams.ItemsPerPage <= 0)
            {
                pagingParams.ItemsPerPage = 1000;  // Mặc định trả về tối đa 1000 bản ghi nếu ItemsPerPage <= 0
            }

            if (pagingParams.ItemsPerPage > 0)
            {
                query = query.Take(pagingParams.ItemsPerPage);  // Lấy số lượng bản ghi theo ItemsPerPage
            }

            // Trả về danh sách kết quả dưới dạng PagingResult
            try
            {
                result.Data = await query.ToListAsync();

            }
            catch (System.NullReferenceException)
            {
                result.TotalRows = 0;
                result.Data = new();
            }
            return result;
        }

        public virtual IQueryable<TDto> All<TEntity, TDto>() where TEntity : class
        {
            return Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>());
        }

        public virtual IQueryable<TDto> All<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping) where TEntity : class
        {
            return _repository.All<TEntity>().Select(mapping);
        }

        public virtual IQueryable<TDto> FromSqlRaw<TEntity, TDto>(string sql, params object[] parameters) where TEntity : class
        {
            return Extensions.ProjectTo<TDto>((IQueryable)_repository.FromSqlRaw<TEntity>(sql, parameters), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>());
        }

        public virtual IQueryable<TDto> FromSqlRaw<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, string sql, params object[] parameters) where TEntity : class
        {
            return _repository.FromSqlRaw<TEntity>(sql, parameters).Select(mapping);
        }

        public virtual int Count<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates).Count();
        }

        public virtual int Count<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return _repository.All<TEntity>().Select(mapping).WhereMany(predicates)
                .Count();
        }

        public virtual async Task<int> CountAsync<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return await Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates).CountAsync();
        }

        public virtual async Task<int> CountAsync<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return await _repository.All<TEntity>().Select(mapping).WhereMany(predicates)
                .CountAsync();
        }

        public virtual TDto Find<TEntity, TDto>(object id) where TEntity : class
        {
            return ((IMapperBase)_mapper).Map<TEntity, TDto>(_repository.Find<TEntity>(id));
        }

        public virtual TDto Find<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, object id) where TEntity : class
        {
            return mapping.Compile()(_repository.Find<TEntity>(id));
        }

        public virtual TDto Find<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates).FirstOrDefault();
        }

        public virtual TDto Find<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return _repository.All<TEntity>().Select(mapping).WhereMany(predicates)
                .FirstOrDefault();
        }

        public virtual async Task<TDto> FindAsync<TEntity, TDto>(object id) where TEntity : class
        {
            TEntity val = await _repository.FindAsync<TEntity>(id);
            return ((IMapperBase)_mapper).Map<TEntity, TDto>(val);
        }

        public virtual async Task<TDto> FindAsync<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, object id) where TEntity : class
        {
            Func<TEntity, TDto> func = mapping.Compile();
            return func(await _repository.FindAsync<TEntity>(id));
        }

        public virtual async Task<TDto> FindAsync<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return await Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates).FirstOrDefaultAsync();
        }

        public virtual async Task<TDto> FindAsync<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return await _repository.All<TEntity>().Select(mapping).WhereMany(predicates)
                .FirstOrDefaultAsync();
        }

        public virtual IQueryable<TDto> Filter<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return Extensions.ProjectTo<TDto>((IQueryable)_repository.Filter(Array.Empty<Expression<Func<TEntity, bool>>>()), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates);
        }

        public virtual IQueryable<TDto> Filter<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return _repository.Filter(Array.Empty<Expression<Func<TEntity, bool>>>()).Select(mapping).WhereMany(predicates);
        }

        public virtual PagingResult<TDto> FilterPaged<TEntity, TDto>(PagingParams<TDto> pagingParams, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            if (pagingParams == null)
            {
                throw new ArgumentNullException("pagingParams");
            }

            PagingResult<TDto> pagingResult = new PagingResult<TDto>
            {
                PageSize = pagingParams.ItemsPerPage,
                CurrentPage = pagingParams.Page
            };
            IQueryable<TDto> source = Extensions.ProjectTo<TDto>((IQueryable)_repository.Filter(Array.Empty<Expression<Func<TEntity, bool>>>()), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>());
            List<Expression<Func<TDto, bool>>> predicates2 = pagingParams.GetPredicates();
            if (predicates2 != null && predicates2.Any())
            {
                source = source.WhereMany(predicates2);
            }

            if (predicates != null && predicates.Any())
            {
                source = source.WhereMany(predicates);
            }

            pagingResult.TotalRows = source.Count();
            if (pagingParams.SortExpression != null)
            {
                source = source.OrderBy(pagingParams.SortExpression);
                if (pagingParams.StartingIndex > 0)
                {
                    source = source.Skip(pagingParams.StartingIndex);
                }
            }

            if (pagingParams.ItemsPerPage != -1 && pagingParams.ItemsPerPage <= 0)
            {
                pagingParams.ItemsPerPage = 100;
            }

            if (pagingParams.ItemsPerPage > 0)
            {
                source = source.Take(pagingParams.ItemsPerPage);
            }

            pagingResult.Data = source.ToList();
            return pagingResult;
        }

        public virtual PagingResult<TDto> FilterPaged<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, PagingParams<TDto> pagingParams, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            if (pagingParams == null)
            {
                throw new ArgumentNullException("pagingParams");
            }

            PagingResult<TDto> pagingResult = new PagingResult<TDto>
            {
                PageSize = pagingParams.ItemsPerPage,
                CurrentPage = pagingParams.Page
            };
            IQueryable<TDto> source = _repository.Filter(Array.Empty<Expression<Func<TEntity, bool>>>()).Select(mapping);
            List<Expression<Func<TDto, bool>>> predicates2 = pagingParams.GetPredicates();
            if (predicates2 != null && predicates2.Any())
            {
                source = source.WhereMany(predicates2);
            }

            if (predicates != null && predicates.Any())
            {
                source = source.WhereMany(predicates);
            }

            pagingResult.TotalRows = source.Count();
            if (pagingParams.SortExpression != null)
            {
                source = source.OrderBy(pagingParams.SortExpression);
                if (pagingParams.StartingIndex > 0)
                {
                    source = source.Skip(pagingParams.StartingIndex);
                }
            }

            if (pagingParams.ItemsPerPage != -1 && pagingParams.ItemsPerPage <= 0)
            {
                pagingParams.ItemsPerPage = 100;
            }

            if (pagingParams.ItemsPerPage > 0)
            {
                source = source.Take(pagingParams.ItemsPerPage);
            }

            pagingResult.Data = source.ToList();
            return pagingResult;
        }

        public virtual async Task<PagingResult<TDto>> FilterPagedAsync<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, PagingParams<TDto> pagingParams, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            if (pagingParams == null)
            {
                throw new ArgumentNullException("pagingParams");
            }

            PagingResult<TDto> result = new PagingResult<TDto>
            {
                PageSize = pagingParams.ItemsPerPage,
                CurrentPage = pagingParams.Page
            };
            IQueryable<TDto> query = _repository.Filter(Array.Empty<Expression<Func<TEntity, bool>>>()).Select(mapping);
            List<Expression<Func<TDto, bool>>> predicates2 = pagingParams.GetPredicates();
            if (predicates2 != null && predicates2.Any())
            {
                query = query.WhereMany(predicates2);
            }

            if (predicates != null && predicates.Any())
            {
                query = query.WhereMany(predicates);
            }

            PagingResult<TDto> pagingResult = result;
            pagingResult.TotalRows = await query.CountAsync();
            if (pagingParams.SortExpression != null)
            {
                query = query.OrderBy(pagingParams.SortExpression);
                if (pagingParams.StartingIndex > 0)
                {
                    query = query.Skip(pagingParams.StartingIndex);
                }
            }

            if (pagingParams.ItemsPerPage != -1 && pagingParams.ItemsPerPage <= 0)
            {
                pagingParams.ItemsPerPage = 100;
            }

            if (pagingParams.ItemsPerPage > 0)
            {
                query = query.Take(pagingParams.ItemsPerPage);
            }

            try
            {
                pagingResult = result;
                pagingResult.Data = await query.ToListAsync();

            }
            catch (System.NullReferenceException)
            {
                pagingResult.TotalRows = 0;
                pagingResult.Data = new();
            }
            return result;
        }

        public virtual bool Contain<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates).Any();
        }

        public virtual bool Contain<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return _repository.All<TEntity>().Select(mapping).WhereMany(predicates)
                .Any();
        }

        public virtual async Task<bool> ContainAsync<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return await Extensions.ProjectTo<TDto>((IQueryable)_repository.All<TEntity>(), _mapper.ConfigurationProvider, Array.Empty<Expression<Func<TDto, object>>>()).WhereMany(predicates).AnyAsync();
        }

        public virtual async Task<bool> ContainAsync<TEntity, TDto>(Expression<Func<TEntity, TDto>> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            return await _repository.All<TEntity>().Select(mapping).WhereMany(predicates)
                .AnyAsync();
        }

        public virtual void Create<TEntity, TDto>(params TDto[] dtos) where TEntity : class where TDto : class
        {
            TEntity[] array = ((IMapperBase)_mapper).Map<TDto[], TEntity[]>(dtos);
            _repository.Create(array);
            if (InternalApi.Internal(_mapper.ConfigurationProvider).FindTypeMapFor<TEntity, TDto>() != null)
            {
                for (int i = 0; i < array.Length; i++)
                {
                    ((IMapperBase)_mapper).Map<TEntity, TDto>(array[i], dtos[i]);
                }
            }
        }

        public virtual void Create<TEntity, TDto>(Func<TDto, TEntity> mapping, params TDto[] dtos) where TEntity : class where TDto : class
        {
            TEntity[] array = dtos.Select(mapping).ToArray();
            _repository.Create(array);
            if (InternalApi.Internal(_mapper.ConfigurationProvider).FindTypeMapFor<TEntity, TDto>() != null)
            {
                for (int i = 0; i < array.Length; i++)
                {
                    ((IMapperBase)_mapper).Map<TEntity, TDto>(array[i], dtos[i]);
                }
            }
        }

        public virtual async Task CreateAsync<TEntity, TDto>(params TDto[] dtos) where TEntity : class where TDto : class
        {
            TEntity[] entities = ((IMapperBase)_mapper).Map<TDto[], TEntity[]>(dtos);
            await _repository.CreateAsync(entities);
            if (InternalApi.Internal(_mapper.ConfigurationProvider).FindTypeMapFor<TEntity, TDto>() != null)
            {
                for (int i = 0; i < entities.Length; i++)
                {
                    ((IMapperBase)_mapper).Map<TEntity, TDto>(entities[i], dtos[i]);
                }
            }
        }

        public virtual async Task CreateAsync<TEntity, TDto>(Func<TDto, TEntity> mapping, params TDto[] dtos) where TEntity : class where TDto : class
        {
            TEntity[] entities = dtos.Select(mapping).ToArray();
            await _repository.CreateAsync(entities);
            if (InternalApi.Internal(_mapper.ConfigurationProvider).FindTypeMapFor<TEntity, TDto>() != null)
            {
                for (int i = 0; i < entities.Length; i++)
                {
                    ((IMapperBase)_mapper).Map<TEntity, TDto>(entities[i], dtos[i]);
                }
            }
        }

        public virtual int Delete<TEntity, TKey>(TKey id) where TEntity : class
        {
            return _repository.Delete<TEntity, TKey>(id);
        }

        public virtual int Delete<TEntity, TKey>(TKey[] ids) where TEntity : class
        {
            return _repository.Delete<TEntity, TKey>(ids);
        }

        public virtual int Delete<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            List<TDto> list = Filter<TEntity, TDto>(predicates).ToList();
            return _repository.Delete(((IMapperBase)_mapper).Map<List<TDto>, List<TEntity>>(list).ToArray());
        }

        public virtual int Delete<TEntity, TDto>(Func<TDto, TEntity> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            List<TDto> source = Filter<TEntity, TDto>(predicates).ToList();
            return _repository.Delete(source.Select(mapping).ToArray());
        }

        public virtual async Task<int> DeleteAsync<TEntity, TKey>(TKey id) where TEntity : class
        {
            return await _repository.DeleteAsync<TEntity, TKey>(id);
        }

        public virtual async Task<int> DeleteAsync<TEntity, TKey>(TKey[] ids) where TEntity : class
        {
            return await _repository.DeleteAsync<TEntity, TKey>(ids);
        }

        public virtual async Task<int> DeleteAsync<TEntity, TDto>(params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            List<TDto> list = await Filter<TEntity, TDto>(predicates).ToListAsync();
            return await _repository.DeleteAsync(((IMapperBase)_mapper).Map<List<TDto>, List<TEntity>>(list).ToArray());
        }

        public virtual async Task<int> DeleteAsync<TEntity, TDto>(Func<TDto, TEntity> mapping, params Expression<Func<TDto, bool>>[] predicates) where TEntity : class
        {
            List<TDto> source = await Filter<TEntity, TDto>(predicates).ToListAsync();
            return await _repository.DeleteAsync(source.Select(mapping).ToArray());
        }

        public virtual int Update<TEntity, TDto>(object id, TDto dto) where TEntity : class where TDto : class
        {
            TEntity val = _repository.Find<TEntity>(id);
            ((IMapperBase)_mapper).Map<TDto, TEntity>(dto, val);
            return _repository.Update<TEntity>(val);
        }

        public virtual int Update<TEntity, TDto>(Action<TDto, TEntity> mapping, object id, TDto dto) where TEntity : class where TDto : class
        {
            TEntity val = _repository.Find<TEntity>(id);
            mapping(dto, val);
            return _repository.Update<TEntity>(val);
        }

        public virtual async Task<int> UpdateAsync<TEntity, TDto>(object id, TDto dto) where TEntity : class where TDto : class
        {
            TEntity val = await _repository.FindAsync<TEntity>(id);
            ((IMapperBase)_mapper).Map<TDto, TEntity>(dto, val);
            return await _repository.UpdateAsync<TEntity>(val);
        }

        public virtual async Task<int> UpdateAsync<TEntity, TDto>(Action<TDto, TEntity> mapping, object id, TDto dto) where TEntity : class where TDto : class
        {
            TEntity val = await _repository.FindAsync<TEntity>(id);
            mapping(dto, val);
            return await _repository.UpdateAsync<TEntity>(val);
        }

        public virtual int Update<TEntity, TDto, TKey>(params TDto[] dtos) where TEntity : class where TDto : class, IIdentifier<TKey>
        {
            List<TEntity> list = new List<TEntity>();
            foreach (TDto val in dtos)
            {
                TEntity val2 = _repository.Find<TEntity>(val.Id);
                ((IMapperBase)_mapper).Map<TDto, TEntity>(val, val2);
                list.Add(val2);
            }

            return _repository.Update(list.ToArray());
        }

        public virtual int Update<TEntity, TDto, TKey>(Action<TDto, TEntity> mapping, params TDto[] dtos) where TEntity : class where TDto : class, IIdentifier<TKey>
        {
            List<TEntity> list = new List<TEntity>();
            foreach (TDto val in dtos)
            {
                TEntity val2 = _repository.Find<TEntity>(val.Id);
                mapping(val, val2);
                list.Add(val2);
            }

            return _repository.Update(list.ToArray());
        }

        public virtual async Task<int> UpdateAsync<TEntity, TDto, TKey>(params TDto[] dtos) where TEntity : class where TDto : class, IIdentifier<TKey>
        {
            List<TEntity> entities = new List<TEntity>();
            foreach (TDto dto in dtos)
            {
                TEntity val = await _repository.FindAsync<TEntity>(dto.Id);
                ((IMapperBase)_mapper).Map<TDto, TEntity>(dto, val);
                entities.Add(val);
            }

            return await _repository.UpdateAsync(entities.ToArray());
        }

        public virtual async Task<int> UpdateAsync<TEntity, TDto, TKey>(Action<TDto, TEntity> mapping, params TDto[] dtos) where TEntity : class where TDto : class, IIdentifier<TKey>
        {
            List<TEntity> entities = new List<TEntity>();
            foreach (TDto dto in dtos)
            {
                TEntity val = await _repository.FindAsync<TEntity>(dto.Id);
                mapping(dto, val);
                entities.Add(val);
            }

            return await _repository.UpdateAsync(entities.ToArray());
        }

        public virtual int ExecuteNonQuery(string sql, params object[] sqlParams)
        {
            return _repository.ExecuteNonQuery(sql, sqlParams);
        }

        public virtual TContext GetDbContext<TContext>() where TContext : class
        {
            return _repository.GetDbContext<TContext>();
        }

        public virtual IDbContextTransaction BeginTransaction()
        {
            return _repository.BeginTransaction();
        }

        public virtual IDbContextTransaction BeginTransaction(IsolationLevel isolationLevel)
        {
            return _repository.BeginTransaction(isolationLevel);
        }

        public virtual void Dispose()
        {
            if (_repository != null)
            {
                _repository.Dispose();
                _repository = null;
            }
        }

    }
}
