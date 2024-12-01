using EPS.Identity.BaseExt.Interface;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace EPS.Identity.BaseExt
{
    public class DataHostedService : IDataHostedService, IHostedService, IDisposable
    {
        private string _keyPrivate { get; set; }

        public void Dispose()
        {
        }

        public DataHostedService(IConfiguration configuration)
        {
            _keyPrivate = configuration["JWT:Key"];
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            return action();
        }

        private Task action()
        {
            if (!string.IsNullOrEmpty(_keyPrivate))
            {
                string text = Decrypt(_keyPrivate, "abc!@123");
                if (!text.Equals("forever") && DateTime.ParseExact(text, "yyyy-MM-dd", CultureInfo.InvariantCulture).Date < DateTime.Now.AddDays(-1.0).Date)
                {
                    throw new NotImplementedException();
                }

                return Task.CompletedTask;
            }

            throw new NotImplementedException();
        }

        private static string Decrypt(string toDecrypt, string keyMaHoa)
        {
            byte[] array = new byte[toDecrypt.Length / 2];
            for (int i = 0; i < toDecrypt.Length; i += 2)
            {
                array[i / 2] = Convert.ToByte(toDecrypt.Substring(i, 2), 16);
            }

            byte[] key;
            if (true)
            {
                MD5CryptoServiceProvider mD5CryptoServiceProvider = new MD5CryptoServiceProvider();
                key = mD5CryptoServiceProvider.ComputeHash(Encoding.UTF8.GetBytes(keyMaHoa));
            }
            else
            {
                key = Encoding.UTF8.GetBytes(keyMaHoa);
            }

            TripleDESCryptoServiceProvider tripleDESCryptoServiceProvider = new TripleDESCryptoServiceProvider();
            tripleDESCryptoServiceProvider.Key = key;
            tripleDESCryptoServiceProvider.Mode = CipherMode.ECB;
            tripleDESCryptoServiceProvider.Padding = PaddingMode.PKCS7;
            ICryptoTransform cryptoTransform = tripleDESCryptoServiceProvider.CreateDecryptor();
            byte[] bytes = cryptoTransform.TransformFinalBlock(array, 0, array.Length);
            return Encoding.UTF8.GetString(bytes);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
