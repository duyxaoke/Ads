using System.Data;
using System.Data.SqlClient;

namespace Cash4Aff.Infra.Data.Context
{
    public class ConnectionFactory : IConnectionFactory
    {
        private IDbConnection _connection;
        private readonly string _connectionString;

        public ConnectionFactory(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IDbConnection GetConnection()
        {
            if (_connection == null)
                _connection = new SqlConnection(_connectionString);
            if (_connection.State == ConnectionState.Closed) _connection.Open();
            return _connection;
        }

        public void Dispose()
        {
            if (_connection != null && _connection.State == ConnectionState.Open)
                _connection.Close();
        }
    }

}
