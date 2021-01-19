using System;
using System.Data;

namespace Cash4Aff.Infra.Data.Context
{
    public interface IConnectionFactory : IDisposable
    {
        IDbConnection GetConnection();
    }

}
