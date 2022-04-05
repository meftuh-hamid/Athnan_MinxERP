using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Objects;
using System.Linq.Expressions;
using System.Data;
using System.Data.Objects.DataClasses;
using System.Data.Entity;

namespace CyberErp.Data.Infrastructure
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class, new()
    {
        #region Members

        private DbContext _dbContext;
        private readonly IDbSet<TEntity> _objectSet;

        #endregion

        #region Constructor

        public Repository(DbContext dbContext)
        {
            _dbContext = dbContext;
            _objectSet = _dbContext.Set<TEntity>();
        }

        public Repository(DbContext dbContext, bool lazyLoadingEnabled)
        {
            _dbContext = dbContext;
            _objectSet = _dbContext.Set<TEntity>();
            _dbContext.Configuration.LazyLoadingEnabled = lazyLoadingEnabled;
        }

        #endregion

        #region Methods

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public void Add(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _objectSet.Add(entity);
        }
        public void Add(IEnumerable<TEntity> entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            foreach (var e in entity)
            {
                _objectSet.Add(e);
            }
        }

        public void Edit(TEntity entity)
        {
            _objectSet.Attach(entity);
            _dbContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
        }

        public void Delete(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            _objectSet.Remove(entity);
        }

        public void Delete(Expression<Func<TEntity, bool>> predicate)
        {
            var records = Find(predicate);
            foreach (var record in records)
            {
                Delete(record);
            }
        }

        public void DeleteRelatedEntities(TEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }
            var relatedEntities =
                ((IEntityWithRelationships)entity).RelationshipManager.GetAllRelatedEnds().SelectMany(
                    e => e.CreateSourceQuery().OfType<TEntity>()).ToList();
            foreach (var relatedEntity in relatedEntities)
            {
                _objectSet.Remove(relatedEntity);
            }
            _objectSet.Remove(entity);
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _objectSet.AsEnumerable();
        }

        public IEnumerable<TEntity> GetAll(int start, int limit)
        {
            return _objectSet.AsEnumerable().Skip(start).Take(limit);
        }

        public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
        {
            return _objectSet.Where(predicate).AsEnumerable();
        }

        public IEnumerable<TEntity> Find(int page, int pageSize, Expression<Func<TEntity, bool>> predicate)
        {
            return _objectSet.Where(predicate).Skip(page).Take(pageSize).AsEnumerable();
        }

        public TEntity Single(Expression<Func<TEntity, bool>> predicate)
        {
            return _objectSet.SingleOrDefault(predicate);
        }

        public TEntity Single()
        {
            return _objectSet.SingleOrDefault();
        }

        public TEntity First(Expression<Func<TEntity, bool>> predicate)
        {
            return _objectSet.FirstOrDefault(predicate);
        }

        public int Count()
        {
            return _objectSet.Count();
        }

        public int Count(Expression<Func<TEntity, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposing) return;
            if (_dbContext == null) return;
            _dbContext.Dispose();
            _dbContext = null;
        }

        #endregion
    }

    public class Repository
    {
        #region Members

        private readonly DbContext _dbContext;

        #endregion

        #region Constructor

        public Repository(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        #endregion

        #region Methods

        public void Add(coreLookup lookup, string table)
        {

            var commandText = string.Format("Insert into {0}(Name, Code, IsDeleted,Id) Values('{1}', '{2}', {3}, '{4}')", table, lookup.Name.Replace("'", @"''"), lookup.Code.Replace("'", @"''"), 0, Guid.NewGuid()  );
            _dbContext.Database.ExecuteSqlCommand(commandText);
        }

        public void Edit(coreLookup lookup, string table)
        {
            var commandText = string.Format("Update {0} Set Name='{1}', Code='{2}' Where Id='{3}'", table, lookup.Name.Replace("'", @"''"), lookup.Code.Replace("'", @"''"), lookup.Id);
            _dbContext.Database.ExecuteSqlCommand(commandText);
        }

        public void Delete(Guid id, string table)
        {
            var commandText = string.Format("Delete {0} Where Id='{1}'", table, id);
            _dbContext.Database.ExecuteSqlCommand(commandText);
        }

        public coreLookup Get(Guid id, string table)
        {
            var commandText = string.Format("Select * From {0} Where Id='{1}'", table, id);
            return _dbContext.Database.SqlQuery<coreLookup>(commandText).SingleOrDefault();
        }

        public IEnumerable<coreLookup> GetAll(string table)
        {
            var commandText = string.Format("Select * from {0}", table);
            return _dbContext.Database.SqlQuery<coreLookup>(commandText).ToList();
        }

        public IEnumerable<coreLookup> GetAll(int start, int limit, string table)
        {
            var commandText = string.Format("Select * from {0}", table);
            return _dbContext.Database.SqlQuery<coreLookup>(commandText).Skip(start).Take(limit);
        }

        #endregion
    }

    public class coreLookup
    {
        #region Properties

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsDeleted { get; set; }

        #endregion
    }
}
