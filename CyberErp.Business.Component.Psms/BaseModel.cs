using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using System.Linq.Expressions;
using System.Data.Entity;
using CyberErp.Data.Infrastructure;
using CyberErp.Data.Model;

namespace CyberErp.Business.Component.Psms
{
    public class BaseModel<TEntity> where TEntity : class, new()
    {
        #region Members

        private readonly DbContext _dbContext;
        private readonly IRepository<TEntity> _repository;

        #endregion

        #region Constructor

        public BaseModel(string connectionString)
        {
            _dbContext = new ErpEntities(connectionString);
            _repository = new Repository<TEntity>(_dbContext, true);
        }

        public BaseModel(DbContext dbContext)
        {
            _dbContext = dbContext;
            _repository = new Repository<TEntity>(_dbContext, true);
        }

        #endregion

        #region Methods

        public TEntity Get(Expression<Func<TEntity, bool>> predicate)
        {
            return _repository.Single(predicate);
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _repository.GetAll();
        }

        public TEntity Find(Expression<Func<TEntity, bool>> predicate)
        {
            return _repository.First(predicate);
        }

        public TEntity Single()
        {
            return _repository.Single();
        }

        public void AddNew(TEntity entity)
        {
            _repository.Add(entity);
            _repository.SaveChanges();
        }
        public void AddNewList(IEnumerable<TEntity> entity)
        {
            _repository.Add(entity);
            _repository.SaveChanges();
        }
        public void Edit(TEntity entity)
        {
            _repository.Edit(entity);
            _repository.SaveChanges();
        }

        public void Delete(Expression<Func<TEntity, bool>> predicate)
        {
            _repository.Delete(predicate);
            _repository.SaveChanges();
        }

        public void DeleteAll()
        {
            var records = _repository.GetAll();
            foreach (var record in records)
            {
                _repository.Delete(record);
            }
            _repository.SaveChanges();
        }

        public void SaveChanges()
        {
            _repository.SaveChanges();
        }

        #endregion
    }
}
