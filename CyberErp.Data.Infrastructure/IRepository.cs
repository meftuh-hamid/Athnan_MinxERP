using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq.Expressions;

namespace CyberErp.Data.Infrastructure
{
    public interface IRepository<TEntity> : IDisposable where TEntity : class, new()
    {
        #region Methods

        /// <summary>
        /// Saves changes on the given context against the database
        /// </summary>
        void SaveChanges();

        /// <summary>
        /// Adds entity to the context
        /// </summary>
        /// <param name="entity">Entity</param>
        void Add(TEntity entity);

        void Add(IEnumerable<TEntity> entity);


        /// <summary>
        /// Edits entity on the context
        /// </summary>
        /// <param name="entity">Entity</param>
        void Edit(TEntity entity);

        /// <summary>
        /// Deletes entity from the context
        /// </summary>
        /// <param name="entity">Entity</param>
        void Delete(TEntity entity);

        /// <summary>
        /// Deletes entity or entities from the context based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        void Delete(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Deletes entity and related entities from the context
        /// </summary>
        /// <param name="entity"></param>
        void DeleteRelatedEntities(TEntity entity);

        /// <summary>
        /// Gets all entities
        /// </summary>
        /// <returns>IEnumerable of entities</returns>
        IEnumerable<TEntity> GetAll();

        /// <summary>
        /// Gets all entities as paged
        /// </summary>
        /// <param name="start">page number</param>
        /// <param name="limit">page size</param>
        /// <returns>IEnumerable of entities as paged</returns>
        IEnumerable<TEntity> GetAll(int start, int limit);

        /// <summary>
        /// Finds entities based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of entities</returns>
        IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Finds entities as paged based on the given predicate
        /// </summary>
        /// <param name="page">page number</param>
        /// <param name="pageSize">page size</param>
        /// <param name="predicate">where clause</param>
        /// <returns>IEnumerable of entities as paged</returns>
        IEnumerable<TEntity> Find(int page, int pageSize, Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Gets single entity based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>only one entity</returns>
        TEntity Single(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Gets single entity
        /// </summary>
        /// <returns>only one entity</returns>
        TEntity Single();

        /// <summary>
        /// Gets first entity based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>first entity</returns>
        TEntity First(Expression<Func<TEntity, bool>> predicate);

        /// <summary>
        /// Gets count
        /// </summary>
        /// <returns>count of entities</returns>
        int Count();

        /// <summary>
        /// Gets count based on the given predicate
        /// </summary>
        /// <param name="predicate">where clause</param>
        /// <returns>count of entities</returns>
        int Count(Expression<Func<TEntity, bool>> predicate);

        #endregion
    }
}
